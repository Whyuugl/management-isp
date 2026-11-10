# Management ISP (Internet Service Provider)

[![Laravel](https://img.shields.io/badge/Laravel-13.x-FF2D20?style=flat&logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat&logo=react)](https://react.dev)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-v3-9553E9?style=flat)](https://inertiajs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?style=flat&logo=mysql)](https://www.mysql.com)

Aplikasi operasional terpadu untuk penyedia layanan internet (ISP) guna mengelola siklus pelanggan, penerbitan & pembayaran tagihan bulanan, pelaporan metrik performa, serta kontrol hak akses pengguna.

---

## 📚 Indeks Dokumentasi Terstruktur

Untuk menjaga keterbacaan dan kedalaman teknis, dokumentasi proyek dipisahkan ke dalam folder [`docs/`](./docs/):

| Dokumen | Topik Pembahasan |
|---|---|
| [**1. Panduan Instalasi & Setup**](./docs/installation.md) | Prasyarat sistem, langkah instalasi langkah-demi-langkah, konfigurasi `.env`, dan seeding database |
| [**2. Panduan Penggunaan Pengguna**](./docs/user-guide.md) | Panduan operasional langkah-demi-langkah untuk Administrator dan Staff pada setiap modul aplikasi |
| [**3. Arsitektur & Peran (Role & Security)**](./docs/architecture-and-roles.md) | Desain monolitik Inertia, middleware autentikasi & autorisasi, serta matriks perizinan |
| [**4. Desain Database & Skema Relasi**](./docs/database-schema.md) | Detail tabel MySQL (`users`, `customers`, `invoices`), soft deletes, relasi, dan strategi integritas data |
| [**5. Panduan API & Rute Internal**](./docs/api-routes.md) | Daftar endpoint internal Laravel, metode HTTP, controller, middleware, dan struktur payload |
| [**6. Panduan Deployment & Produksi**](./docs/deployment.md) | Konfigurasi server produksi, build aset, optimasi caching Laravel, dan checklist keamanan |

---

## ⚡ Quick Start (Pengujian Cepat)

```bash
# 1. Clone & install dependensi
composer install
npm install

# 2. Setup environment & database
cp .env.example .env
php artisan key:generate
php artisan migrate --seed

# 3. Jalankan aplikasi (Dev Mode)
composer run dev
```

Aplikasi dapat diakses pada browser di: **`http://localhost:8000`**

### Kredensial Bawaan (Default Seed)
Password untuk seluruh akun: **`password`**

- **Administrator:** `admin@isp.co.id` atau `wahyu@isp.co.id` (Akses Penuh)
- **Staff ISP:** `staff@isp.co.id` atau `siti@isp.co.id` (Operasional Pelanggan & Tagihan)

---

## 🛠 Perintah Penting (Development Commands)

```bash
npm run check -- --fix    # Linter & Formatter Vite Plus
npm run types:check       # Validasi TypeScript
npm run build             # Kompilasi aset frontend
vendor/bin/pint           # Formatter standar PHP Laravel Pint
php artisan test          # Menjalankan pengujian aplikasi
```
