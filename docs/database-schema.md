# Desain Database & Skema Relasi

Dokumen ini memaparkan struktur tabel, tipe data, indeks, konvensi penamaan, dan kebijakan integritas data aplikasi Management ISP.

---

## 1. Diagram Relasi Entitas (ERD)

```
 +--------------------+             +----------------------------+
 |       users        |             |         customers          |
 +--------------------+             +----------------------------+
 | id (PK)            |             | id (PK)                    |
 | name               |             | name                       |
 | email (UQ)         |             | phone                      |
 | password           |             | address                    |
 | role (ENUM)        |             | internet_package           |
 | remember_token     |             | package_price              |
 | created_at         |             | status (ENUM)              |
 | updated_at         |             | created_at                 |
 +--------------------+             | updated_at                 |
                                    | deleted_at (TIMESTAMP/NULL)|
                                    +--------------+-------------+
                                                   | 1
                                                   |
                                                   | 0..*
                                    +--------------v-------------+
                                    |          invoices          |
                                    +----------------------------+
                                    | id (PK)                    |
                                    | customer_id (FK)           |
                                    | billing_period (DATE)      |
                                    | amount (DECIMAL 12,2)      |
                                    | status (ENUM)              |
                                    | paid_at (TIMESTAMP/NULL)   |
                                    | created_at                 |
                                    | updated_at                 |
                                    +----------------------------+
```

---

## 2. Struktur Tabel & Kolom

### A. Tabel `users`
Menyimpan akun pengguna aplikasi (Administrator dan Staff).

| Kolom | Tipe Data | Modifiers | Deskripsi |
|---|---|---|---|
| `id` | `BIGINT UNSIGNED` | `AUTO_INCREMENT, PRIMARY KEY` | Identifier unik pengguna |
| `name` | `VARCHAR(255)` | `NOT NULL` | Nama lengkap pengguna |
| `email` | `VARCHAR(255)` | `NOT NULL, UNIQUE` | Alamat email unik untuk login |
| `email_verified_at` | `TIMESTAMP` | `NULL` | Waktu verifikasi email |
| `password` | `VARCHAR(255)` | `NOT NULL` | Password ter-hash (Bcrypt) |
| `role` | `ENUM('administrator', 'staff')` | `NOT NULL, DEFAULT 'staff'` | Hak akses sistem |
| `remember_token` | `VARCHAR(100)` | `NULL` | Token sesi login persisten |
| `created_at` | `TIMESTAMP` | `NULL` | Waktu akun didaftarkan |
| `updated_at` | `TIMESTAMP` | `NULL` | Waktu akun terakhir diperbarui |

### B. Tabel `customers`
Menyimpan seluruh data profil pelanggan ISP.

| Kolom | Tipe Data | Modifiers | Deskripsi |
|---|---|---|---|
| `id` | `BIGINT UNSIGNED` | `AUTO_INCREMENT, PRIMARY KEY` | Identifier unik pelanggan |
| `name` | `VARCHAR(255)` | `NOT NULL, INDEX` | Nama pelanggan |
| `phone` | `VARCHAR(30)` | `NOT NULL, INDEX` | Nomor kontak telepon / WhatsApp |
| `address` | `TEXT` | `NOT NULL` | Alamat lengkap lokasi pemasangan |
| `internet_package` | `VARCHAR(100)` | `NOT NULL` | Nama paket layanan yang dipilih |
| `package_price` | `DECIMAL(12,2)` | `NOT NULL` | Biaya bulanan layanan |
| `status` | `ENUM('active', 'suspended', 'disconnected')` | `NOT NULL, DEFAULT 'active'` | Status langganan |
| `created_at` | `TIMESTAMP` | `NULL` | Waktu registrasi pelanggan |
| `updated_at` | `TIMESTAMP` | `NULL` | Waktu pembaruan data |
| `deleted_at` | `TIMESTAMP` | `NULL, INDEX` | Kolom penanda soft delete |

### C. Tabel `invoices`
Menyimpan data tagihan layanan bulanan dan catatan status pelunasan.

| Kolom | Tipe Data | Modifiers | Deskripsi |
|---|---|---|---|
| `id` | `BIGINT UNSIGNED` | `AUTO_INCREMENT, PRIMARY KEY` | Identifier unik invoice |
| `customer_id` | `BIGINT UNSIGNED` | `NOT NULL, FOREIGN KEY (customers.id)` | ID referensi pelanggan |
| `billing_period` | `DATE` | `NOT NULL, INDEX` | Tanggal periode tagihan (hari pertama bulan: `YYYY-MM-01`) |
| `amount` | `DECIMAL(12,2)` | `NOT NULL` | Nominal yang ditagihkan |
| `status` | `ENUM('unpaid', 'paid')` | `NOT NULL, DEFAULT 'unpaid', INDEX` | Status pelunasan tagihan |
| `paid_at` | `TIMESTAMP` | `NULL` | Tanggal & waktu pelunasan dicatat |
| `created_at` | `TIMESTAMP` | `NULL` | Waktu invoice diterbitkan |
| `updated_at` | `TIMESTAMP` | `NULL` | Waktu invoice diubah |

---

## 3. Kebijakan Integritas & Konvensi Bisnis

### A. Kebijakan Soft Delete pada Pelanggan
- Model `Customer` menggunakan trait `Illuminate\Database\Eloquent\SoftDeletes`.
- Saat pelanggan dihapus, data **tidak dihilangkan secara fisik** dari tabel MySQL (`DELETE FROM`), melainkan kolom `deleted_at` diisi waktu saat itu (`UPDATE customers SET deleted_at = NOW()`).
- Data yang telah di-soft-delete otomatis disaring keluar dari query biasa (`Customer::all()`), sehingga tidak muncul lagi di tabel antarmuka pelanggan.

### B. Foreign Key Tanpa Cascade Delete (Audit Trail Aman)
- Relasi antara tabel `invoices` dan `customers` dikonfigurasi **tanpa `ON DELETE CASCADE`**:
  ```php
  $table->foreignId('customer_id')->constrained('customers');
  ```
- Di level Eloquent Model `Invoice.php`, relasi pelanggan memanggil `withTrashed()`:
  ```php
  public function customer(): BelongsTo
  {
      return $this->belongsTo(Customer::class)->withTrashed();
  }
  ```
- **Alasan:** Bila pelanggan nonaktif atau dihapus, riwayat tagihan dan laporan keuangan masa lalu tetap mempertahankan nama dan identitas pelanggan secara utuh tanpa menyebabkan *orphan records* atau error null reference.

### C. Format Kode Invoice Antarmuka (`INV-YYYY-XXXX`)
Di tabel database, primary key disimpan sebagai angka terurut integer (`1`, `2`, `3`, ...). Pada antarmuka pengguna, kode invoice disintesis secara konsisten:
```
INV-{Tahun Pembuatan}-{ID 4 Digit Terisi Nol}
Contoh: ID 1 dibuat tahun 2026 -> "INV-2026-0001"
```
Format ini memudahkan pembacaan oleh staf dan kasir tanpa membebani indeks database.
