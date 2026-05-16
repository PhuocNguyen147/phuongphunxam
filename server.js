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
const SUPABASE_URL = String(process.env.SUPABASE_URL || '').replace(/\/$/, '');
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SUPABASE_STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'phuong-beauty';
const SUPABASE_DATA_TABLE = process.env.SUPABASE_DATA_TABLE || 'app_data';
const HAS_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
const CONTENT_KEY = 'site_content';
const BOOKINGS_KEY = 'bookings';

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
  const nextContent = { ...content };

  if (!content.gallerySections && Array.isArray(content.gallery)) {
    nextContent.gallerySections = [
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
      ];
  }

  if (!nextContent.aftercare) {
    nextContent.aftercare = {
      badge: 'Cẩm nang hậu phẫu',
      title: 'Hướng dẫn chăm sóc đúng cách',
      description: 'Các hướng dẫn chăm sóc sau khi làm dịch vụ.',
      sections: [],
      cta: {
        title: 'Bạn có thắc mắc trong quá trình chăm sóc?',
        description: 'Liên hệ với Phuong Beauty để được hỗ trợ.',
        primaryText: 'Gọi Hotline',
        secondaryText: 'Chat Messenger',
      },
    };
  }

  if (!nextContent.serviceShowcase) {
    nextContent.serviceShowcase = {
      title: 'Nghệ thuật Phun Xăm Tự Nhiên',
      description: '',
      beforeLabel: 'Trước',
      afterLabel: 'Sau',
      beforeImage: { title: '', url: '' },
      afterImage: { title: '', url: '' },
      cards: [],
      stats: [],
      quote: { text: '', author: '', role: '', avatar: '' },
    };
  }

  if (!Array.isArray(nextContent.showcaseSections)) {
    nextContent.showcaseSections = [];
  }

  return nextContent;
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

async function supabaseRequest(path, options = {}) {
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    method: options.method || 'GET',
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      ...options.headers,
    },
    body: options.body,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => '');
    throw new Error(`Supabase error ${response.status}: ${message || response.statusText}`);
  }

  if (options.raw) return response;

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function readDataRecord(key, fallback) {
  if (!HAS_SUPABASE) return readJson(key === CONTENT_KEY ? CONTENT_FILE : BOOKINGS_FILE, fallback);

  const rows = await supabaseRequest(`/rest/v1/${SUPABASE_DATA_TABLE}?key=eq.${encodeURIComponent(key)}&select=value&limit=1`);
  return rows?.[0]?.value ?? fallback;
}

async function writeDataRecord(key, value) {
  if (!HAS_SUPABASE) {
    await writeJson(key === CONTENT_KEY ? CONTENT_FILE : BOOKINGS_FILE, value);
    return value;
  }

  const rows = await supabaseRequest(`/rest/v1/${SUPABASE_DATA_TABLE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify({
      key,
      value,
      updated_at: new Date().toISOString(),
    }),
  });

  return rows?.[0]?.value ?? value;
}

async function ensureStorage() {
  await mkdir(DATA_DIR, { recursive: true });
  await mkdir(UPLOAD_DIR, { recursive: true });

  if (!existsSync(BOOKINGS_FILE)) {
    await writeJson(BOOKINGS_FILE, []);
  }

  if (!HAS_SUPABASE) return;

  const existingContent = await readDataRecord(CONTENT_KEY, null);
  if (!existingContent) {
    await writeDataRecord(CONTENT_KEY, await readJson(CONTENT_FILE, {}));
  }

  const existingBookings = await readDataRecord(BOOKINGS_KEY, null);
  if (!Array.isArray(existingBookings)) {
    await writeDataRecord(BOOKINGS_KEY, await readJson(BOOKINGS_FILE, []));
  }
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
  const phone = String(input.phone || '').replace(/\D/g, '');
  if (phone.length < 9 || phone.length > 11) {
    return 'Phone must contain 9 to 11 digits.';
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
  const imageBuffer = Buffer.from(match[2], 'base64');

  if (HAS_SUPABASE) {
    const storagePath = `uploads/${fileName}`;
    const encodedPath = storagePath.split('/').map(encodeURIComponent).join('/');
    await supabaseRequest(`/storage/v1/object/${encodeURIComponent(SUPABASE_STORAGE_BUCKET)}/${encodedPath}`, {
      method: 'POST',
      raw: true,
      headers: {
        'Content-Type': match[1] === 'image/jpg' ? 'image/jpeg' : match[1],
        'x-upsert': 'false',
      },
      body: imageBuffer,
    });

    sendJson(res, 201, {
      url: `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${encodedPath}`,
    });
    return;
  }

  await writeFile(join(UPLOAD_DIR, fileName), imageBuffer);

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
      sendJson(res, 200, { ok: true, storage: HAS_SUPABASE ? 'supabase' : 'json' });
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
      sendJson(res, 200, normalizeContent(await readDataRecord(CONTENT_KEY, {})));
      return;
    }

    if (url.pathname === '/api/content' && req.method === 'PUT') {
      if (!requireAdmin(req, res)) return;
      const content = await readBody(req);
      await writeDataRecord(CONTENT_KEY, content);
      sendJson(res, 200, content);
      return;
    }

    if (url.pathname === '/api/bookings' && req.method === 'GET') {
      if (!requireAdmin(req, res)) return;
      sendJson(res, 200, await readDataRecord(BOOKINGS_KEY, []));
      return;
    }

    if (url.pathname === '/api/bookings' && req.method === 'POST') {
      const body = await readBody(req);
      const validationError = validateBooking(body);
      if (validationError) {
        sendJson(res, 400, { error: validationError });
        return;
      }

      const bookings = await readDataRecord(BOOKINGS_KEY, []);
      const booking = {
        id: crypto.randomUUID(),
        name: body.name.trim(),
        phone: String(body.phone || '').replace(/\D/g, ''),
        service: body.service.trim(),
        date: body.date,
        time: body.time,
        note: String(body.note || '').trim(),
        status: 'new',
        rescheduledDate: '',
        rescheduledTime: '',
        createdAt: new Date().toISOString(),
      };
      bookings.unshift(booking);
      await writeDataRecord(BOOKINGS_KEY, bookings);
      sendJson(res, 201, booking);
      return;
    }

    if (url.pathname.startsWith('/api/bookings/') && req.method === 'PATCH') {
      if (!requireAdmin(req, res)) return;
      const id = url.pathname.split('/').pop();
      const body = await readBody(req);
      const bookings = await readDataRecord(BOOKINGS_KEY, []);
      const nextBookings = bookings.map((booking) => (
        booking.id === id ? { ...booking, ...body, updatedAt: new Date().toISOString() } : booking
      ));
      await writeDataRecord(BOOKINGS_KEY, nextBookings);
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
