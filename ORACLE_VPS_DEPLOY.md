# Huong Dan Deploy Len Oracle Cloud VPS Free

Tai lieu nay dung cho website Phuong Beauty: React frontend + Node.js backend + Supabase database.

## 1. Nen chon cau hinh nao?

Tren Oracle Cloud, hay tao may ao thuoc nhom **Always Free**:

- Image: Ubuntu 22.04 hoac Ubuntu 24.04
- Shape: Ampere A1 Flex neu tao duoc, hoac VM.Standard.E2.1.Micro
- Mo cong: 22, 80, 443
- Luu private key SSH that ky, vi mat key se kho dang nhap lai server.

Neu Oracle hoi VCN/Security List/NSG, them Ingress Rules:

| Cong | Giao thuc | Muc dich |
| --- | --- | --- |
| 22 | TCP | SSH vao VPS |
| 80 | TCP | Website HTTP |
| 443 | TCP | Website HTTPS |

## 2. Tro ten mien ve VPS

Trong noi quan ly ten mien, tao DNS:

| Type | Name | Value |
| --- | --- | --- |
| A | @ | IP public cua VPS |
| A hoac CNAME | www | IP public cua VPS hoac @ |

Neu chua co ten mien, ban van co the test bang IP public cua VPS, nhung SSL HTTPS bang Certbot can ten mien that.

## 3. Dang nhap VPS bang Windows PowerShell

Vi du:

```powershell
ssh -i C:\Users\Phuoc\Downloads\oracle-key.key ubuntu@YOUR_SERVER_IP
```

Neu file key bi bao loi quyen, chay tren PowerShell:

```powershell
icacls C:\Users\Phuoc\Downloads\oracle-key.key /inheritance:r
icacls C:\Users\Phuoc\Downloads\oracle-key.key /grant:r "$env:USERNAME:R"
```

Sau do SSH lai.

## 4. Cai cong cu tren VPS

Chay:

```bash
curl -fsSL https://raw.githubusercontent.com/PhuocNguyen147/phuongphunxam/codex/admin-gallery-booking/deploy/oracle/bootstrap-ubuntu.sh -o bootstrap-ubuntu.sh
bash bootstrap-ubuntu.sh
```

Dang xuat SSH roi dang nhap lai de quyen Docker co hieu luc:

```bash
exit
ssh -i C:\Users\Phuoc\Downloads\oracle-key.key ubuntu@YOUR_SERVER_IP
```

## 5. Tai code va tao file cau hinh

Chay:

```bash
curl -fsSL https://raw.githubusercontent.com/PhuocNguyen147/phuongphunxam/codex/admin-gallery-booking/deploy/oracle/deploy.sh -o deploy.sh
bash deploy.sh
```

Lan dau script se tao file `.env.production` roi dung lai. Mo file nay:

```bash
nano /opt/phuong-beauty/.env.production
```

Dien cac dong quan trong:

```env
ADMIN_PASSWORD=mat-khau-admin-cua-ban
ADMIN_TOKEN_SECRET=chuoi-bi-mat-dai-kho-doan
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxxx
SUPABASE_STORAGE_BUCKET=phuong-beauty
SUPABASE_DATA_TABLE=app_data
```

Tao chuoi bi mat bang lenh:

```bash
openssl rand -hex 32
```

Sau khi sua xong, bam `Ctrl + O`, `Enter`, roi `Ctrl + X`.

## 6. Chay website

Chay lai:

```bash
bash deploy.sh
```

Kiem tra:

```bash
curl http://127.0.0.1:8787/api/health
```

Neu thay `"ok":true` la app da chay trong VPS.

Neu thay `"storage":"supabase"` la database Supabase da ket noi dung.

## 7. Cau hinh Nginx cho ten mien

Copy file Nginx:

```bash
sudo cp /opt/phuong-beauty/deploy/oracle/nginx-phuong-beauty.conf /etc/nginx/sites-available/phuong-beauty
```

Sua ten mien:

```bash
sudo nano /etc/nginx/sites-available/phuong-beauty
```

Doi:

```nginx
server_name your-domain.com www.your-domain.com;
```

Thanh ten mien cua ban, vi du:

```nginx
server_name phuongbeauty.com www.phuongbeauty.com;
```

Bat cau hinh:

```bash
sudo ln -sf /etc/nginx/sites-available/phuong-beauty /etc/nginx/sites-enabled/phuong-beauty
sudo nginx -t
sudo systemctl reload nginx
```

Bay gio mo:

```txt
http://ten-mien-cua-ban.com
```

## 8. Cai HTTPS mien phi

Khi DNS da tro dung ve VPS, chay:

```bash
sudo certbot --nginx -d ten-mien-cua-ban.com -d www.ten-mien-cua-ban.com
```

Sau do website se co HTTPS.

## 9. Cap nhat code moi sau nay

Moi lan ban push code len GitHub, SSH vao VPS va chay:

```bash
cd /opt/phuong-beauty
BRANCH=codex/admin-gallery-booking bash deploy/oracle/deploy.sh
```

Neu sau nay da merge vao main, chay:

```bash
cd /opt/phuong-beauty
BRANCH=main bash deploy/oracle/deploy.sh
```

## 10. Du lieu admin co mat khi update code khong?

Neu da cau hinh Supabase:

- Anh upload trong admin luu tren Supabase Storage.
- Noi dung admin luu trong Supabase.
- Lich hen luu trong Supabase.
- Push code moi va deploy lai se khong lam mat du lieu admin.

Neu chua cau hinh Supabase:

- App se luu tam trong Docker volume tren VPS.
- Du lieu khong mat khi deploy lai bang Docker Compose.
- Nhung van nen backup va nen dung Supabase cho an toan hon.

## 11. Lenh xem log khi bi loi

```bash
cd /opt/phuong-beauty
docker compose -f docker-compose.oracle.yml logs -f
```

Khoi dong lai:

```bash
docker compose -f docker-compose.oracle.yml restart
```

Dung app:

```bash
docker compose -f docker-compose.oracle.yml down
```
