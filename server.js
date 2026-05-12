import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import crypto from 'node:crypto';

const PORT = Number(process.env.PORT || 8787);
const ROOT = process.cwd();
const DATA_DIR = join(ROOT, 'data');
const DIST_DIR = join(ROOT, 'dist');
const PUBLIC_DIR = join(ROOT, 'public');
const UPLOAD_DIR = join(PUBLIC_DIR, 'uploads');
const CONTENT_FILE = join(DATA_DIR, 'siteContent.json');
const BOOKINGS_FILE = join(DATA_DIR, 'bookings.json');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || crypto.randomBytes(32).toString('hex');
const TOKEN_TTL_MS = 1000 * 60 * 60 * 12;

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

function normalizeContent(content) {
  if (!content.gallerySections && Array.isArray(content.gallery)) {
    return {
      ...content,
      gallerySections: [
        {
          id: 'lips',
          label: 'Làm môi',
          description: 'Màu môi sau bong, dáng môi và feedback khách hàng.',
          images: content.gallery.slice(0, 3),
        },
        {
          id: 'lashes',
          label: 'Làm mi',
          description: 'Các kiểu nối mi, uốn mi và dáng mi thiết kế.',
          images: content.gallery.slice(3, 6),
        },
        {
          id: 'brows',
          label: 'Làm mày',
          description: 'Điêu khắc Hairstroke, shading và xử lý mày cũ.',
          images: content.gallery.slice(0, 4),
        },
      ],
    };
  }

  return content;
}

async function ensureStorage() {
  await mkdir(DATA_DIR, { recursive: true });
  await mkdir(UPLOAD_DIR, { recursive: true });

  if (!existsSync(BOOKINGS_FILE)) {
    await writeJson(BOOKINGS_FILE, []);
  }
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

async function writeJson(file, data) {
  await writeFile(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, jsonHeaders);
  res.end(JSON.stringify(payload));
}

function createAdminToken() {
  const payload = {
    exp: Date.now() + TOKEN_TTL_MS,
    role: 'admin',
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

function isValidAdminToken(token) {
  if (!token || !token.includes('.')) return false;
  const [encodedPayload, signature] = token.split('.');
  const expectedSignature = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  if (signature !== expectedSignature) return false;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
    return payload.role === 'admin' && payload.exp > Date.now();
  } catch {
    return false;
  }
}

function requireAdmin(req, res) {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (isValidAdminToken(token)) return true;

  sendJson(res, 401, { error: 'Vui lòng đăng nhập admin.' });
  return false;
}

function notFound(res) {
  sendJson(res, 404, { error: 'Not found' });
}

function validateBooking(input) {
  const required = ['name', 'phone', 'service', 'date', 'time'];
  const missing = required.filter((field) => !String(input[field] || '').trim());
  if (missing.length) {
    return `Missing fields: ${missing.join(', ')}`;
  }
  return null;
}

async function handleImageUpload(req, res) {
  const body = await readBody(req);
  const match = String(body.dataUrl || '').match(/^data:(image\/(?:png|jpeg|jpg|webp));base64,(.+)$/);

  if (!match) {
    sendJson(res, 400, { error: 'Image must be png, jpg, jpeg, or webp data URL.' });
    return;
  }

  const extension = match[1].includes('png') ? 'png' : match[1].includes('webp') ? 'webp' : 'jpg';
  const safeName = String(body.name || 'image')
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48) || 'image';
  const fileName = `${Date.now()}-${safeName}-${crypto.randomUUID().slice(0, 8)}.${extension}`;
  await writeFile(join(UPLOAD_DIR, fileName), Buffer.from(match[2], 'base64'));

  sendJson(res, 201, { url: `/uploads/${fileName}` });
}

async function handleStatic(req, res) {
  const rawPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
  if (!rawPath.startsWith('/uploads/')) {
    notFound(res);
    return;
  }

  const filePath = normalize(join(PUBLIC_DIR, rawPath));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    notFound(res);
    return;
  }

  try {
    const file = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[extname(filePath)] || 'application/octet-stream' });
    res.end(file);
  } catch {
    notFound(res);
  }
}

async function serveDistFile(req, res) {
  if (!existsSync(DIST_DIR)) {
    notFound(res);
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const requestedPath = url.pathname === '/' ? '/index.html' : url.pathname;
  const filePath = normalize(join(DIST_DIR, requestedPath));

  if (!filePath.startsWith(DIST_DIR)) {
    notFound(res);
    return;
  }

  try {
    const file = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[extname(filePath)] || 'application/octet-stream' });
    res.end(file);
  } catch {
    try {
      const indexHtml = await readFile(join(DIST_DIR, 'index.html'));
      res.writeHead(200, { 'Content-Type': mimeTypes['.html'] });
      res.end(indexHtml);
    } catch {
      notFound(res);
    }
  }
}

async function router(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, jsonHeaders);
    res.end();
    return;
  }

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === '/api/health') {
      sendJson(res, 200, { ok: true });
      return;
    }

    if (url.pathname === '/api/admin/login' && req.method === 'POST') {
      const body = await readBody(req);
      if (String(body.password || '') !== ADMIN_PASSWORD) {
        sendJson(res, 401, { error: 'Sai mật khẩu admin.' });
        return;
      }

      sendJson(res, 200, { token: createAdminToken() });
      return;
    }

    if (url.pathname === '/api/content' && req.method === 'GET') {
      sendJson(res, 200, normalizeContent(await readJson(CONTENT_FILE, {})));
      return;
    }

    if (url.pathname === '/api/content' && req.method === 'PUT') {
      if (!requireAdmin(req, res)) return;
      const content = await readBody(req);
      await writeJson(CONTENT_FILE, content);
      sendJson(res, 200, content);
      return;
    }

    if (url.pathname === '/api/bookings' && req.method === 'GET') {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 200, await readJson(BOOKINGS_FILE, []));
      return;
    }

    if (url.pathname === '/api/bookings' && req.method === 'POST') {
      const body = await readBody(req);
      const validationError = validateBooking(body);
      if (validationError) {
        sendJson(res, 400, { error: validationError });
        return;
      }

      const bookings = await readJson(BOOKINGS_FILE, []);
      const booking = {
        id: crypto.randomUUID(),
        name: body.name.trim(),
        phone: body.phone.trim(),
        service: body.service.trim(),
        date: body.date,
        time: body.time,
        note: String(body.note || '').trim(),
        status: 'new',
        createdAt: new Date().toISOString(),
      };
      bookings.unshift(booking);
      await writeJson(BOOKINGS_FILE, bookings);
      sendJson(res, 201, booking);
      return;
    }

    if (url.pathname.startsWith('/api/bookings/') && req.method === 'PATCH') {
      if (!requireAdmin(req, res)) return;
      const id = url.pathname.split('/').pop();
      const body = await readBody(req);
      const bookings = await readJson(BOOKINGS_FILE, []);
      const nextBookings = bookings.map((booking) => (
        booking.id === id ? { ...booking, ...body, updatedAt: new Date().toISOString() } : booking
      ));
      await writeJson(BOOKINGS_FILE, nextBookings);
      sendJson(res, 200, nextBookings.find((booking) => booking.id === id) || null);
      return;
    }

    if (url.pathname === '/api/images' && req.method === 'POST') {
      if (!requireAdmin(req, res)) return;
      await handleImageUpload(req, res);
      return;
    }

    if (url.pathname.startsWith('/uploads/')) {
      await handleStatic(req, res);
      return;
    }

    await serveDistFile(req, res);
  } catch (error) {
    sendJson(res, 500, { error: error.message || 'Server error' });
  }
}

await ensureStorage();

createServer(router).listen(PORT, () => {
  console.log(`Backend is running at http://localhost:${PORT}`);
});
