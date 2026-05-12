const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8787' : '');
const ADMIN_TOKEN_KEY = 'phuongBeautyAdminToken';

function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

function setAdminToken(token) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (options.auth) {
    const token = getAdminToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    headers,
    ...options,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error || 'Không thể kết nối máy chủ.');
  }

  return payload;
}

export function resolveMediaUrl(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url) || url.startsWith('data:')) return url;
  return `${API_BASE}${url}`;
}

export const api = {
  getAdminToken,
  clearAdminToken,
  login: async (password) => {
    const payload = await request('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
    setAdminToken(payload.token);
    return payload;
  },
  getContent: () => request('/api/content'),
  saveContent: (content) => request('/api/content', {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(content),
  }),
  createBooking: (booking) => request('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(booking),
  }),
  getBookings: () => request('/api/bookings', { auth: true }),
  updateBooking: (id, changes) => request(`/api/bookings/${id}`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify(changes),
  }),
  uploadImage: (image) => request('/api/images', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(image),
  }),
};
