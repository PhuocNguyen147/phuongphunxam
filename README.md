# Phuong Beauty

Website React + Vite co backend Node nho de quan ly noi dung, hinh anh va lich hen.
Trang admin cung co the sua trang huong dan cham soc.

## Chay tren may

```bash
npm install
npm run server
npm run dev
```

- Website: http://127.0.0.1:5173
- Admin: http://127.0.0.1:5173/admin
- Backend API: http://localhost:8787

Mat khau admin mac dinh khi chua cau hinh bien moi truong la `admin123`.
Khi deploy that, hay doi `ADMIN_PASSWORD` va `ADMIN_TOKEN_SECRET`.

## Build production

```bash
npm run build
npm start
```

Sau khi build, `server.js` se phuc vu ca API va website trong thu muc `dist`.

## File huong dan

Xem [HUONG_DAN_SU_DUNG.md](./HUONG_DAN_SU_DUNG.md) de biet cach su dung admin, noi luu database va cach deploy mien phi.
