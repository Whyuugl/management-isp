# Panduan Endpoint Rute Internal & Spesifikasi Payload

Aplikasi ini menggunakan perutean monolitik Inertia. Seluruh rute berada di file `routes/web.php` dan berinteraksi melalui response Inertia / Redirect back dengan flash message.

---

## 1. Ringkasan Endpoint

| Method | URI | Nama Rute | Controller & Action | Middleware | Deskripsi |
|---|---|---|---|---|---|
| `GET` | `/` | `home` | `AuthenticatedSessionController@create` | `guest` | Redirect / tampilan login |
| `GET` | `/login` | `login` | `AuthenticatedSessionController@create` | `guest` | Form login |
| `POST` | `/login` | - | `AuthenticatedSessionController@store` | `guest` | Proses autentikasi |
| `POST` | `/logout` | `logout` | `AuthenticatedSessionController@destroy` | `auth` | Menghancurkan sesi login |
| `GET` | `/dashboard` | `dashboard` | `DashboardController@index` | `auth` | Halaman dashboard & analitik |
| `GET` | `/pelanggan` | `pelanggan` | `CustomerController@index` | `auth` | Halaman daftar pelanggan |
| `POST` | `/pelanggan` | `pelanggan.store` | `CustomerController@store` | `auth` | Menambah pelanggan baru |
| `PUT` | `/pelanggan/{customer}` | `pelanggan.update` | `CustomerController@update` | `auth` | Memperbarui pelanggan |
| `DELETE`| `/pelanggan/{customer}` | `pelanggan.destroy`| `CustomerController@destroy` | `auth`, `role.administrator` | Soft delete pelanggan |
| `GET` | `/tagihan` | `tagihan` | `InvoiceController@index` | `auth` | Halaman daftar invoice |
| `POST` | `/tagihan` | `tagihan.store` | `InvoiceController@store` | `auth`, `role.administrator` | Menerbitkan invoice baru |
| `PUT` | `/tagihan/{invoice}/pay`| `tagihan.pay` | `InvoiceController@pay` | `auth`, `role.administrator` | Melunasi status invoice |
| `GET` | `/profil` | `profil` | `ProfileController@edit` | `auth` | Halaman profil akun |
| `POST` | `/profil/password` | `profil.password` | `ProfileController@updatePassword`| `auth` | Update sandi pengguna |
| `GET` | `/pengaturan` | `pengaturan` | `ProfileController@settings` | `auth` | Halaman pengaturan sistem |
| `GET` | `/users` | `users` | `UserController@index` | `auth`, `role.administrator` | Daftar pengguna sistem |
| `POST` | `/users` | `users.store` | `UserController@store` | `auth`, `role.administrator` | Buat pengguna baru |
| `PUT` | `/users/{user}` | `users.update` | `UserController@update` | `auth`, `role.administrator` | Perbarui data user |
| `DELETE`| `/users/{user}` | `users.destroy` | `UserController@destroy` | `auth`, `role.administrator` | Hapus akun user |

---

## 2. Rincian Validasi & Payload Request

### A. Tambah / Ubah Pelanggan (`POST /pelanggan` / `PUT /pelanggan/{customer}`)
Payload JSON yang dikirimkan via Inertia:
```json
{
  "name": "PT Sinar Terang Abadi",
  "phone": "081298765432",
  "address": "Gedung Cyber Lt. 5, Jl. Kuningan Barat No. 8, Jakarta Selatan",
  "internet_package": "Office 100 Mbps",
  "package_price": 750000,
  "status": "active"
}
```
**Aturan Validasi Server:**
- `name`: `required|string|max:255`
- `phone`: `required|string|max:30`
- `address`: `required|string`
- `internet_package`: `required|string|max:100`
- `package_price`: `required|numeric|min:0`
- `status`: `required|in:active,suspended,disconnected`

---

### B. Menerbitkan Tagihan Baru (`POST /tagihan`)
Payload JSON:
```json
{
  "customer_id": 3,
  "billing_period": "2026-11",
  "amount": 750000
}
```
**Aturan Validasi Server:**
- `customer_id`: `required|exists:customers,id`
- `billing_period`: `required|date_format:Y-m`
- `amount`: `required|numeric|min:0`

*Catatan: Sistem secara otomatis mengonversi `2026-11` menjadi tanggal hari pertama di database (`2026-11-01`).*

---

### C. Konfirmasi Pembayaran Tagihan (`PUT /tagihan/{invoice}/pay`)
- **URL Parameter:** `{invoice}` (ID integer di database, misal `/tagihan/4/pay`).
- **Payload:** Kosong.
- **Efek di Server:**
  - Status invoice diubah menjadi `paid`.
  - Kolom `paid_at` diisi waktu saat ini (`now()`).
  - Redirect kembali ke halaman tagihan dengan pesan flash: `"Pembayaran tagihan berhasil dicatat."`

---

### D. Perbarui Password Sendiri (`POST /profil/password`)
Payload JSON:
```json
{
  "current_password": "passwordlama123",
  "password": "passwordsuperaman88",
  "password_confirmation": "passwordsuperaman88"
}
```
**Aturan Validasi Server:**
- `current_password`: `required|string|current_password` (memastikan password lama cocok dengan database)
- `password`: `required|string|min:8|confirmed`

---

### E. Tambah / Ubah User (`POST /users` / `PUT /users/{user}`)
Payload JSON Tambah:
```json
{
  "name": "Rian Kusuma",
  "email": "rian@isp.co.id",
  "password": "secretpassword",
  "role": "staff"
}
```
**Aturan Validasi Server:**
- `name`: `required|string|max:255`
- `email`: `required|email|unique:users,email,{id}`
- `role`: `required|in:administrator,staff`
- `password`: `required` pada create (min 8 karakter), `nullable` pada update (jika kosong, password lama tidak diubah).
