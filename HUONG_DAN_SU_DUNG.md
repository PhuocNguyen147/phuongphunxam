# Huong Dan Su Dung Website Phuong Beauty

## 1. Chay website tren may

Mo terminal trong thu muc du an va chay:

```bash
npm install
npm run server
npm run dev
```

Sau do mo:

- Website: http://127.0.0.1:5173
- Trang admin: http://127.0.0.1:5173/admin

Mat khau admin mac dinh la `admin123` neu ban chua dat bien moi truong `ADMIN_PASSWORD`.

## 2. Doi mat khau admin

Khi chay local bang PowerShell:

```powershell
$env:ADMIN_PASSWORD="mat-khau-moi-cua-ban"
$env:ADMIN_TOKEN_SECRET="mot-chuoi-bi-mat-dai-va-kho-doan"
npm run server
```

Khi deploy, dat 2 bien moi truong nay tren dashboard cua nha cung cap hosting:

- `ADMIN_PASSWORD`: mat khau de vao trang admin.
- `ADMIN_TOKEN_SECRET`: chuoi bi mat dai, dung de ky phien dang nhap.

## 3. Quan ly noi dung trong admin

Vao `/admin`, dang nhap, sau do:

- Tab `Noi dung`: sua ten thuong hieu, hotline, Facebook, hero, dich vu va bang gia.
- Tab `Hinh anh`: quan ly rieng 3 khu anh `Anh lam moi`, `Anh lam mi`, `Anh lam may`.
- Tab `Cham soc`: sua trang huong dan cham soc, tung nhom huong dan, tung the noi dung va tung gach dau dong.
- Tab `Lich hen`: xem lich hen khach gui tu form website va cap nhat trang thai.

Sau khi sua noi dung hoac them anh, bam `Luu thay doi`.

## 4. Hieu ung anh tren website

Thu vien anh duoc tach thanh 3 khu rieng:

- Anh lam moi.
- Anh lam mi.
- Anh lam may.

Moi khu anh tu dong chay ngang nhe nhàng. Khi khach re chuot vao tren may tinh hoac cham tay vao carousel tren dien thoai, hieu ung se tam dung de khach xem anh ky hon.

## 5. Database cua website nam o dau?

Ban hien dang dung database dang file JSON:

- Noi dung website: `data/siteContent.json`
- Lich hen: `data/bookings.json`
- Anh upload tu admin: `public/uploads`

Khi chay local, cac file nay nam ngay trong thu muc du an tren may cua ban.

Khi deploy len internet, cac file nay nam tren o dia cua server/instance ma hosting tao ra. Luu y quan trong: tren nhieu goi mien phi, o dia nay la ephemeral filesystem, nghia la du lieu co the mat khi server restart, redeploy hoac bi spin down.

Neu website chi demo hoac moi bat dau, cach nay dung duoc. Neu website da co khach dat lich that, nen nang cap sang:

- Supabase/Neon/Postgres de luu lich hen va noi dung.
- Cloudinary/Supabase Storage de luu anh upload.

## 6. Deploy mien phi goi y

### Cach de nhat: deploy 1 service Node tren Render

Render co Free Web Services, co custom domain/TLS, nhung service free se spin down sau 15 phut khong co traffic va local filesystem bi mat khi redeploy/restart/spin down. Render Free Postgres cung chi ton tai 30 ngay theo tai lieu hien tai.

Thiet lap tren Render:

1. Dang nhap Render va tao `New Web Service`.
2. Ket noi repo GitHub nay.
3. Build command:

```bash
npm install && npm run build
```

4. Start command:

```bash
npm start
```

5. Them Environment Variables:

```text
ADMIN_PASSWORD=mat-khau-admin-cua-ban
ADMIN_TOKEN_SECRET=chuoi-bi-mat-dai-ngau-nhien
```

6. Deploy. Render se cap URL dang `https://ten-app.onrender.com`.

### Lua chon khac: Koyeb

Koyeb co huong dan deploy Node.js/Express tu GitHub va chay bang `npm run start`. Voi code hien tai, ban chon repository, chon buildpack Node.js, build command `npm install && npm run build`, start command `npm start`.

### Khi nao dung Vercel?

Vercel Hobby la goi mien phi cho project ca nhan, nhung ung dung nay co backend Node chay dai va ghi file JSON. Neu deploy Vercel, nen tach frontend len Vercel va doi backend/database sang Supabase hoac mot API rieng. Ban khong nen dung file JSON tren Vercel lam database chinh.

## 7. Kiem tra truoc khi deploy

```bash
npm run lint
npm run build
```

Neu ca hai lenh pass thi code san sang deploy.

## 8. Ghi chu bao mat

- Doi `ADMIN_PASSWORD` truoc khi public website.
- Khong commit file `.env` len GitHub.
- Khong dung `admin123` cho website that.
- File JSON phu hop giai doan dau; neu co booking that, nen dung database ben ngoai de khong mat du lieu.

## 9. Doi mat khau admin sau khi deploy Render

Mat khau admin khong nam trong code. Mat khau duoc doc tu bien moi truong `ADMIN_PASSWORD` tren Render.

De doi mat khau:

1. Vao Render Dashboard.
2. Chon web service cua ban.
3. Vao tab `Environment`.
4. Tim `ADMIN_PASSWORD`.
5. Doi value thanh mat khau moi.
6. Bam `Save Changes`.
7. Render se redeploy hoac restart service.

Neu muon tat ca phien dang nhap cu bi mat hieu luc ngay, doi them `ADMIN_TOKEN_SECRET` sang mot chuoi moi, dai va kho doan. Neu chi doi `ADMIN_PASSWORD`, nhung ai da dang nhap truoc do co the con token cu toi da 12 gio.

## 10. Deploy ban update len Render sau khi push GitHub

Neu Render dang bat auto deploy:

1. Sua code tren may.
2. Commit code.
3. Push len dung branch ma Render dang deploy, vi du `codex/admin-gallery-booking`.
4. Render se tu build va deploy lai.

Lenh thuong dung:

```bash
npm run lint
npm run build
git add .
git commit -m "cap nhat website"
git push
```

Neu Render khong tu deploy:

1. Vao Render Dashboard.
2. Chon web service.
3. Bam `Manual Deploy`.
4. Chon `Deploy latest commit`.

Neu sau nay ban merge code vao `main`, vao Settings cua service tren Render va doi Branch tu `codex/admin-gallery-booking` sang `main`, hoac tao service moi deploy tu `main`.

## 11. Tai lieu tham khao

- Render Free: https://render.com/docs/free
- Koyeb Node/Express deploy: https://www.koyeb.com/docs/deploy/express
- Vercel Hobby: https://vercel.com/docs/plans/hobby
