# Panduan Instalasi & Konfigurasi Sistem

Dokumen ini memandu proses instalasi, konfigurasi awal, dan pemecahan masalah lingkungan lokal untuk aplikasi Management ISP.

---

## 1. Prasyarat Sistem

Sebelum memulai, pastikan perangkat lokal atau server telah terpasang paket berikut:

| Software | Versi Minimum | Keterangan |
|---|---|---|
| **PHP** | 8.2 (Direkomendasikan 8.3 / 8.5) | Ekstensi: `pdo_mysql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`, `bcmath`, `curl` |
| **Composer** | 2.x | Manajer dependensi PHP |
| **Node.js** | 20.x LTS ke atas | Runtime JavaScript |
| **npm** | 10.x ke atas | Manajer paket frontend |
| **MySQL** | 8.0 ke atas | Database Relasional Utama |

Untuk memeriksa versi di terminal:
```bash
php -v
composer -V
node -v
npm -v
mysql --version
```

---

## 2. Langkah-Langkah Instalasi

### Langkah 1: Unduh / Buka Repositori Proyek
Navigasikan terminal ke direktori root aplikasi:
```bash
cd management-isp
```

### Langkah 2: Install Dependensi PHP
Jalankan Composer untuk mengunduh seluruh library backend Laravel:
```bash
composer install
```

### Langkah 3: Install Dependensi Node.js
Jalankan npm untuk mengunduh library frontend (React, Tailwind CSS, Recharts, Lucide, Wayfinder):
```bash
npm install
```

### Langkah 4: Konfigurasi File Lingkungan (`.env`)
Salin file template `.env.example` menjadi `.env`:
```bash
# Linux / macOS
cp .env.example .env

# Windows PowerShell
copy .env.example .env
```

Buka file `.env` menggunakan teks editor (misal VS Code), kemudian sesuaikan konfigurasi database:
```ini
APP_NAME="Management ISP"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_TIMEZONE=Asia/Jakarta
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=management_isp
DB_USERNAME=root
DB_PASSWORD=wahyugalang9090
```

> **Catatan Database:** Jika database `management_isp` belum dibuat di server MySQL lokal, buat terlebih dahulu via CLI / phpMyAdmin / DBeaver:
> ```sql
> CREATE DATABASE IF NOT EXISTS management_isp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> ```

### Langkah 5: Generate Application Encryption Key
Jalankan Artisan command untuk menginisialisasi `APP_KEY` yang digunakan enkripsi sesi:
```bash
php artisan key:generate
```

### Langkah 6: Jalankan Migrasi & Database Seeder
Jalankan migrasi tabel beserta seeder data awal:
```bash
php artisan migrate --seed
```

Perintah di atas akan mengeksekusi:
- Tabel autentikasi & sesi pengguna (`users`, `sessions`).
- Tabel pelanggan dengan soft delete (`customers`).
- Tabel tagihan bulanan (`invoices`).
- **DatabaseSeeder**: Membuat 2 akun Administrator, 2 akun Staff, 8 data pelanggan dengan variasi paket internet, serta 8 riwayat tagihan bulanan.

> **Peringatan Integritas:** Seeder bersifat *idempoten* (`updateOrCreate` / `firstOrCreate`). Menjalankannya berulang kali tidak akan menduplikasi data atau merusak data yang telah ada.

### Langkah 7: Kompilasi Aset Frontend
Lakukan kompilasi aset frontend:
```bash
# Untuk mode produksi (minified)
npm run build

# ATAU untuk mode pengembangan (Hot-Module-Replacement / HMR)
npm run dev
```

---

## 3. Menjalankan Server Aplikasi

Gunakan perintah bawaan Laravel untuk menjalankan server lokal:

```bash
php artisan serve
```

Server lokal akan aktif di port `8000`:
- **URL Aplikasi:** [http://localhost:8000](http://localhost:8000)

Alternatif menjalankan Laravel dan Vite secara serentak (rekomendasi):
```bash
composer run dev
```

---

## 4. Pemecahan Masalah (Troubleshooting)

### A. Gagal Terhubung ke MySQL (`Access denied for user 'root'`)
1. Pastikan servis MySQL aktif di background (XAMPP / Laragon / Windows Service / Docker).
2. Periksa kembali nilai `DB_PASSWORD` di file `.env`.
3. Coba tes koneksi via terminal: `mysql -u root -p`.

### B. Tampilan Vite Mengalami "Unable to locate file in Vite manifest"
Jalankan build ulang aset Vite:
```bash
npm run build
```

### C. Halaman Blank Putih / Error 500
1. Pastikan direktori `storage` dan `bootstrap/cache` memiliki izin tulis (writable):
   ```bash
   chmod -R 775 storage bootstrap/cache
   ```
2. Bersihkan cache konfigurasi lama:
   ```bash
   php artisan optimize:clear
   ```
3. Cek detail pesan kesalahan pada file `storage/logs/laravel.log`.
