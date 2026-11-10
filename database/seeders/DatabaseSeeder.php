<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Seeder data awal aplikasi.
 * Menyiapkan akun default Administrator dan Staff untuk testing & demo.
 */
class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Jalankan seed database.
     */
    public function run(): void
    {
        // 1. Akun Administrator default — akses penuh
        User::updateOrCreate(
            ['email' => 'admin@isp.co.id'],
            [
                'name' => 'Administrator ISP',
                'password' => Hash::make('password'),
                'role' => UserRole::Administrator,
                'email_verified_at' => now(),
            ],
        );

        // 2. Akun Staff default — akses terbatas (tanpa modul user, tanpa hapus data)
        User::updateOrCreate(
            ['email' => 'staff@isp.co.id'],
            [
                'name' => 'Staff Operasional',
                'password' => Hash::make('password'),
                'role' => UserRole::Staff,
                'email_verified_at' => now(),
            ],
        );

        // 3. Tambahan staff untuk mengisi daftar pengguna
        User::updateOrCreate(
            ['email' => 'budi.staff@isp.co.id'],
            [
                'name' => 'Budi Santoso',
                'password' => Hash::make('password'),
                'role' => UserRole::Staff,
                'email_verified_at' => now(),
            ],
        );

        // 4. Data pelanggan contoh (bervariasi status)
        $this->call(CustomerSeeder::class);

        // 5. Data tagihan contoh (unpaid & paid) — relasi ke pelanggan di atas
        $this->call(InvoiceSeeder::class);
    }
}
