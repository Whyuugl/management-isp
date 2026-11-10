# Panduan Penggunaan Aplikasi (User Guide)

Panduan operasional lengkap aplikasi Management ISP untuk pengguna berhak akses **Administrator** dan **Staff**.

---

## 1. Masuk ke Sistem (Login)

1. Buka alamat aplikasi pada browser: `http://localhost:8000/login`.
2. Masukkan alamat **Email** dan **Kata Sandi**.
3. Klik tombol **Masuk ke Sistem**.

### Kredensial Default:
- **Administrator:** `admin@isp.co.id` | Sandi: `password`
- **Staff Operasional:** `staff@isp.co.id` | Sandi: `password`

---

## 2. Navigasi & Tata Letak Antarmuka

Antarmuka terbagi menjadi 3 komponen utama:
- **Sidebar (Menu Kiri):**
  - **Menu Utama:** Dashboard, Pelanggan, Tagihan.
  - **Administrasi (Khusus Admin):** Manajemen User.
  - **Mini Widget Status Hub ISP:** Ringkasan status koneksi sistem.
  - **Footer:** Kartu identitas pengguna saat ini & tombol *Keluar dari Sistem*.
- **Topbar (Header Atas):**
  - Indikator status sistem (*Sistem Online*).
  - Profil pill dengan inisial avatar. Klik untuk membuka menu dropdown (*Profil Akun*, *Pengaturan*, *Keluar*).
- **Area Kerja Utama:** Menampilkan konten halaman dengan breadcrumb ringkas.

---

## 3. Fitur Dashboard Operasional (`/dashboard`)

Dashboard memberikan gambaran menyeluruh kondisi operasional ISP:

1. **Banner Sambutan Dinamis:**
   - Menyapa nama pengguna yang sedang aktif.
   - Menampilkan tanggal hari ini dalam format bahasa Indonesia resmi.
   - Kotak ringkas metrik cepat: Total Pelanggan & Tagihan Tertunggak.
2. **5 Kartu Statistik Utama:**
   - **Total Pelanggan:** Jumlah keseluruhan pelanggan aktif, suspend, dan putus.
   - **Pelanggan Aktif:** Pelanggan yang layanannya beroperasi normal.
   - **Pelanggan Suspend:** Pelanggan yang layanannya ditangguhkan (misal akibat belum bayar).
   - **Pelanggan Putus:** Pelanggan yang telah berhenti berlangganan.
   - **Tagihan Belum Bayar:** Jumlah tagihan yang masih berstatus belum lunas.
3. **Grafik Batang Jumlah Tagihan Per Bulan:**
   - Visualisasi tren penerbitan tagihan dari database MySQL.
   - Dilengkapi tooltip interaktif yang menampilkan jumlah invoice saat cursor diarahkan ke atas batang.
4. **Panel Tagihan Belum Bayar:**
   - Menampilkan 5 invoice tertunggak paling mutakhir.
   - Memuat nama pelanggan, periode penagihan, kode invoice, dan nominal dalam format Rupiah.
   - Tautan **"Kelola di Menu Tagihan"** untuk langsung menuju modul penagihan.

---

## 4. Modul Manajemen Pelanggan (`/pelanggan`)

Digunakan untuk mendata seluruh pelanggan internet ISP.

### A. Melihat & Memfilter Data Pelanggan
- **Kartu Ringkasan:** 4 metrik status di bagian atas tabel.
- **Pencarian Cepat:** Ketik nama atau nomor telepon pada input pencarian (pencarian langsung bekerja tanpa reload halaman).
- **Filter Status:** Pilih dropdown status untuk menyaring pelanggan: *Semua Status*, *Aktif*, *Suspend*, atau *Putus*.
- **Pengurutan (Sorting):** Klik header kolom pada tabel untuk mengurutkan data (Nama, No. Telepon, Paket Internet, Harga, atau Status).
- **Paginasi:** Navigasi 5 data per halaman dengan tombol sebelumnya/berikutnya.

### B. Menambah Pelanggan Baru (Admin & Staff)
1. Klik tombol **+ Tambah Pelanggan** di kanan atas.
2. Isi formulir modal:
   - **Nama Lengkap:** Nama pelanggan / instansi.
   - **Nomor Telepon:** Format nomor telepon aktif (contoh: `08123456789`).
   - **Alamat Pemasangan:** Alamat lengkap lokasi instalasi perangkat/modem.
   - **Paket Internet:** Pilih paket (Home 20 Mbps, Home 50 Mbps, Office 100 Mbps, Dedicated 200 Mbps).
   - **Harga Paket (Rp):** Harga per bulan (dapat diubah sesuai promo).
   - **Status Awal:** Pilih Aktif, Suspend, atau Putus.
3. Klik **Simpan Pelanggan**. Notifikasi sukses akan muncul di sudut kanan atas.

### C. Mengubah Data Pelanggan (Admin & Staff)
1. Pada tabel pelanggan, klik ikon **Pensil (Edit)** pada baris yang diinginkan.
2. Perbarui data pada formulir.
3. Klik **Simpan Perubahan**.

### D. Melihat Rincian Pelanggan
- Klik ikon **Mata (Detail)** untuk membuka modal kartu identitas lengkap pelanggan, mencakup riwayat tanggal pendaftaran.

### E. Menghapus Pelanggan (Khusus Administrator)
- Administrator memiliki akses ikon **Tempat Sampah (Hapus)**.
- Sistem menerapkan **Soft Delete**: Data disembunyikan dari daftar aktif, namun data riwayat tagihan masa lalu tetap tersimpan di database untuk audit keuangan.
- Staff tidak akan melihat tombol hapus ini.

---

## 5. Modul Manajemen Tagihan (`/tagihan`)

Digunakan untuk menerbitkan tagihan bulanan dan mencatat pelunasan biaya layanan.

### A. Ringkasan Keuangan
Bagian atas menampilkan 4 kartu indikator keuangan:
1. **Total Tagihan:** Seluruh invoice yang terbit.
2. **Belum Bayar:** Jumlah invoice yang menunggu pembayaran.
3. **Lunas:** Jumlah invoice yang telah diselesaikan.
4. **Total Nominal Belum Dibayar:** Akumulasi total uang tertunggak dalam Rupiah.

### B. Menerbitkan Tagihan Baru (Khusus Administrator)
1. Klik tombol **+ Tambah Tagihan**.
2. Pilih nama pelanggan pada dropdown (sistem otomatis mengisi nominal default sesuai harga paket pelanggan).
3. Pilih **Periode Tagihan** (format bulan dan tahun, misalnya `2026-11`).
4. Sesuaikan **Nominal Tagihan** apabila ada penyesuaian biaya tambahan.
5. Klik **Simpan Tagihan**. Tagihan baru akan terbit dengan status **Belum Bayar**.

### C. Konfirmasi Pembayaran Tagihan (Khusus Administrator)
1. Temukan invoice yang berstatus warna oranye **Belum Bayar**.
2. Klik tombol **Bayar**.
3. Pada dialog konfirmasi yang muncul, klik **Ya, Konfirmasi Pembayaran**.
4. Status tagihan seketika berubah menjadi hijau **Lunas** dan tanggal bayar tercatat di database.
5. Tombol bayar otomatis hilang pada invoice yang sudah lunas.

---

## 6. Modul Manajemen Pengguna (`/users` - Khusus Administrator)

Modul ini hanya dapat diakses oleh akun dengan role Administrator.

### A. Mendaftarkan Akun Baru
1. Klik **+ Tambah Pengguna**.
2. Masukkan **Nama Lengkap**, **Email**, **Password** (min. 8 karakter), dan tentukan **Role** (`Administrator` atau `Staff`).
3. Klik **Simpan Pengguna**.

### B. Mengubah Pengguna
1. Klik tombol **Edit** pada baris user.
2. Administrator dapat mengubah nama, email, role, serta opsi memperbarui password baru (kosongkan kolom password bila tidak ingin mengubah password user terkait).
3. Klik **Simpan Perubahan**.

### C. Menghapus Pengguna
- Administrator dapat menghapus user lain.
- **Proteksi Keamanan:** Sistem melarang administrator menghapus akun miliknya sendiri saat sesi sedang berjalan.

---

## 7. Profil Akun & Pengaturan

### Profil Akun (`/profil`)
- Klik avatar profil di sudut kanan atas > pilih **Profil Akun**.
- Menampilkan rincian identitas: User ID, Email, Role, dan Waktu Registrasi.
- **Formulir Ubah Password Mandiri:**
  1. Masukkan *Password Saat Ini*.
  2. Masukkan *Password Baru* (minimal 8 karakter).
  3. Masukkan *Konfirmasi Password Baru*.
  4. Klik **Simpan Password**.

### Pengaturan (`/pengaturan`)
- Klik avatar profil > pilih **Pengaturan**.
- Berisi:
  - Formulir pembaruan kata sandi.
  - Kartu informasi sistem: Status database MySQL, tingkat akses pengguna saat ini.
  - Pintasan navigasi cepat ke modul-modul penting.
