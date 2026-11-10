# Panduan Deployment & Produksi (Production Guide)

Dokumen ini berisi standar operasional prosedur untuk men-deploy aplikasi Management ISP ke server produksi (VPS Ubuntu/Debian, Nginx, PHP-FPM, MySQL).

---

## 1. Persiapan Server Linux

### A. Paket yang Diperlukan (Ubuntu 22.04 / 24.04 LTS)
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx mysql-server git curl unzip \
    php8.3 php8.3-fpm php8.3-mysql php8.3-mbstring php8.3-xml \
    php8.3-bcmath php8.3-curl php8.3-zip php8.3-intl
```

### B. Pasang Composer & Node.js
```bash
# Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Node.js 20 LTS via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

---

## 2. Langkah Deployment Kode Sumber

### A. Clone Repositori ke Direktori Web
```bash
cd /var/www
sudo git clone <URL_REPO_ANDA> management-isp
cd management-isp
```

### B. Konfigurasi Kepemilikan & Izin Folder
Web server (biasanya `www-data`) harus memiliki izin tulis ke `storage` dan `bootstrap/cache`:
```bash
sudo chown -R www-data:www-data /var/www/management-isp
sudo chmod -R 775 /var/www/management-isp/storage /var/www/management-isp/bootstrap/cache
```

### C. Install Dependensi Tanpa Dev Dependencies
```bash
composer install --no-dev --optimize-autoloader
npm ci
```

### D. Kompilasi Aset Frontend
```bash
npm run build
```

### E. Konfigurasi `.env` Produksi
Pastikan mode debug dinonaktifkan:
```ini
APP_NAME="Management ISP"
APP_ENV=production
APP_KEY=base64:....(generate via artisan)
APP_DEBUG=false
APP_URL=https://isp.perusahaananda.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=isp_production
DB_USERNAME=isp_user
DB_PASSWORD=StrongProductionPassword_123!

SESSION_DRIVER=database
SESSION_SECURE_COOKIE=true
```

Generate key & jalankan migrasi database:
```bash
php artisan key:generate --force
php artisan migrate --force
```

---

## 3. Optimasi Cache Laravel

Sebelum aplikasi melayani trafik publik, jalankan serangkaian cache untuk performa maksimal:

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

Jika ada pembaruan kode di kemudian hari, jalankan:
```bash
php artisan optimize:clear
php artisan optimize
```

---

## 4. Konfigurasi Nginx Web Server

Buat file blok server baru di `/etc/nginx/sites-available/management-isp`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name isp.perusahaananda.com;
    root /var/www/management-isp/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";

    index index.php;
    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Aktifkan konfigurasi dan reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/management-isp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 5. Pemasangan Sertifikat SSL (HTTPS)

Gunakan Certbot Let's Encrypt gratis:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d isp.perusahaananda.com
```

---

## 6. Checklist Keamanan Produksi

- [ ] `APP_DEBUG=false` sudah diset di `.env`.
- [ ] Database root password telah diamankan dan user database menggunakan kredensial non-root.
- [ ] SSL HTTPS aktif dan redirect HTTP ke HTTPS berjalan otomatis.
- [ ] File `.env` terlindung dari akses publik browser (blok `location ~ /\.(?!well-known).*` di Nginx).
- [ ] Backup otomatis database terjadwal harian menggunakan `mysqldump` atau cron job.
