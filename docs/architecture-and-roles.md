# Arsitektur Aplikasi & Matriks Peran (Role & Security)

Dokumen ini menjelaskan arsitektur monolitik modern berbasis Laravel + Inertia.js serta mekanisme otorisasi peran (Role-Based Access Control).

---

## 1. Arsitektur Monolitik Modern

Aplikasi ini menggunakan pola **Monolitik Modern**:

```
           +---------------------------------------+
           |       Browser Klien (SPA Mode)       |
           |   React 19 + TypeScript + Tailwind    |
           +-------------------+-------------------+
                               |
                   Inertia.js Protocol (XHR/JSON)
                               |
           +-------------------v-------------------+
           |            Laravel 13 Core            |
           |   Routing, Middleware, Controller,    |
           |   Eloquent ORM, Validation, Pint      |
           +-------------------+-------------------+
                               |
                       PDO MySQL Driver
                               |
           +-------------------v-------------------+
           |           MySQL Database              |
           |     users, customers, invoices        |
           +---------------------------------------+
```

### Keunggulan Arsitektur:
- **Tanpa API Terpisah:** Tidak memerlukan manajemen otentikasi token JWT/OAuth yang rumit. Menggunakan session cookie standar Laravel yang aman dari ancaman XSS & CSRF.
- **Single Page Application (SPA) UX:** Transisi halaman terasa instan tanpa reload browser penuh berkat engine Inertia.js v3.
- **Type-Safety:** Route, props, dan payload tervalidasi menggunakan TypeScript dan generator Wayfinder.

---

## 2. Model Otorisasi Peran (RBAC)

Aplikasi membagi pengguna menjadi dua peran utama yang didefinisikan dalam PHP Enum `App\Enums\UserRole`:

1. **`administrator`**: Pengelola tingkat tinggi yang memiliki kendali penuh atas sistem.
2. **`staff`**: Operator harian ISP yang bertanggung jawab melayani pencatatan data pelanggan dan melihat status tagihan.

### Struktur Enum PHP (`app/Enums/UserRole.php`):
```php
enum UserRole: string
{
    case Administrator = 'administrator';
    case Staff = 'staff';

    public function label(): string
    {
        return match ($this) {
            self::Administrator => 'Administrator',
            self::Staff => 'Staff',
        };
    }
}
```

---

## 3. Matriks Perizinan Fitur (Permissions Matrix)

| Aksi / Kemampuan | Administrator | Staff | Lapisan Pengamanan |
|---|:---:|:---:|---|
| **Login & Logout** | ✅ | ✅ | Middleware `guest` & `auth` |
| **Melihat Dashboard & Tren** | ✅ | ✅ | Controller `DashboardController@index` |
| **Melihat Daftar Pelanggan** | ✅ | ✅ | Controller `CustomerController@index` |
| **Menambah Pelanggan Baru** | ✅ | ✅ | FormRequest validasi di `CustomerController@store` |
| **Mengubah Data Pelanggan** | ✅ | ✅ | FormRequest validasi di `CustomerController@update` |
| **Menghapus Pelanggan** | ✅ | ❌ | Middleware `role.administrator` + SoftDeletes |
| **Melihat Daftar Tagihan** | ✅ | ✅ | Controller `InvoiceController@index` |
| **Menerbitkan Tagihan Baru** | ✅ | ❌ | Middleware `role.administrator` |
| **Konfirmasi Pembayaran Tagihan** | ✅ | ❌ | Middleware `role.administrator` |
| **Melihat Daftar User** | ✅ | ❌ | Middleware `role.administrator` |
| **Tambah / Edit User** | ✅ | ❌ | Middleware `role.administrator` |
| **Hapus User** | ✅ | ❌ | Middleware `role.administrator` + Guard Self-Delete |
| **Ganti Password Sendiri** | ✅ | ✅ | `ProfileController@updatePassword` + `current_password` rule |

---

## 4. Mekanisme Pengamanan Dua Lapis (Two-Layer Security)

Sistem menerapkan prinsip *Defense in Depth* agar keamanan tidak hanya bertumpu pada tampilan antarmuka:

### A. Lapisan Frontend (UX Guard)
- Menu navigasi disaring otomatis oleh helper `navigationForRole()` di `resources/js/config/navigation.ts`.
- Tombol aksi seperti *Hapus Pelanggan*, *Tambah Tagihan*, dan *Bayar Tagihan* disembunyikan secara kondisional berdasarkan prop `isAdministrator`.

### B. Lapisan Backend (Server-Side Middleware Guard)
Bila ada upaya bypass melalui curl, Postman, atau modifikasi DOM browser, server Laravel akan memblokir request melalui middleware kustom:

`app/Http/Middleware/EnsureUserHasRole.php`:
```php
public function handle(Request $request, Closure $next, string ...$roles): Response
{
    $user = $request->user();

    if (! $user || ! in_array($user->role->value, $roles, true)) {
        abort(403, 'Aksi ini hanya diperbolehkan untuk pengguna dengan hak akses Administrator.');
    }

    return $next($request);
}
```

Middleware ini didaftarkan sebagai alias `role.administrator` pada file konfigurasi rute (`routes/web.php`):
```php
Route::middleware('role.administrator')->group(function (): void {
    Route::delete('/pelanggan/{customer}', [CustomerController::class, 'destroy'])->name('pelanggan.destroy');
    Route::post('/tagihan', [InvoiceController::class, 'store'])->name('tagihan.store');
    Route::put('/tagihan/{invoice}/pay', [InvoiceController::class, 'pay'])->name('tagihan.pay');
    Route::resource('users', UserController::class)->except(['create', 'show', 'edit']);
});
```
Jika pengguna dengan role `staff` memanggil endpoint di atas, server langsung mengembalikan respon HTTP status **403 Forbidden**.
