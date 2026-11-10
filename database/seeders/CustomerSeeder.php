<?php

namespace Database\Seeders;

use App\Enums\CustomerStatus;
use App\Models\Customer;
use Illuminate\Database\Seeder;

/**
 * Seeder data pelanggan contoh.
 * Idempotent: aman dijalankan berulang (kunci unik: nomor telepon).
 */
class CustomerSeeder extends Seeder
{
    /**
     * Data dummy realistis dengan variasi status.
     *
     * @var array<int, array{name: string, phone: string, address: string, internet_package: string, package_price: int, status: CustomerStatus}>
     */
    private array $customers = [
        [
            'name' => 'Budi Santoso',
            'phone' => '081234567890',
            'address' => 'Jl. Merdeka No. 12, Bandung',
            'internet_package' => 'Home 30 Mbps',
            'package_price' => 300000,
            'status' => CustomerStatus::Active,
        ],
        [
            'name' => 'Siti Aminah',
            'phone' => '081322223333',
            'address' => 'Jl. Kenanga No. 5, Jakarta',
            'internet_package' => 'Home 20 Mbps',
            'package_price' => 250000,
            'status' => CustomerStatus::Active,
        ],
        [
            'name' => 'PT Maju Bersama',
            'phone' => '0215551234',
            'address' => 'Jl. Sudirman No. 88, Jakarta',
            'internet_package' => 'Business 100 Mbps',
            'package_price' => 1200000,
            'status' => CustomerStatus::Active,
        ],
        [
            'name' => 'Ahmad Fauzi',
            'phone' => '085711112222',
            'address' => 'Jl. Melati No. 3, Surabaya',
            'internet_package' => 'Home 50 Mbps',
            'package_price' => 350000,
            'status' => CustomerStatus::Suspend,
        ],
        [
            'name' => 'Dewi Lestari',
            'phone' => '081944445555',
            'address' => 'Jl. Anggrek No. 7, Depok',
            'internet_package' => 'Home 20 Mbps',
            'package_price' => 250000,
            'status' => CustomerStatus::Active,
        ],
        [
            'name' => 'CV Karya Abadi',
            'phone' => '0317779999',
            'address' => 'Jl. Pemuda No. 21, Surabaya',
            'internet_package' => 'Business 200 Mbps',
            'package_price' => 2500000,
            'status' => CustomerStatus::Disconnected,
        ],
        [
            'name' => 'Rina Wati',
            'phone' => '081277778888',
            'address' => 'Jl. Dahlia No. 9, Bekasi',
            'internet_package' => 'Home 30 Mbps',
            'package_price' => 300000,
            'status' => CustomerStatus::Suspend,
        ],
        [
            'name' => 'Joko Widodo',
            'phone' => '081399990000',
            'address' => 'Jl. Cempaka No. 2, Semarang',
            'internet_package' => 'Home 50 Mbps',
            'package_price' => 350000,
            'status' => CustomerStatus::Active,
        ],
    ];

    /**
     * Jalankan seeder pelanggan.
     */
    public function run(): void
    {
        foreach ($this->customers as $customer) {
            Customer::updateOrCreate(
                ['phone' => $customer['phone']],
                [
                    'name' => $customer['name'],
                    'address' => $customer['address'],
                    'internet_package' => $customer['internet_package'],
                    'package_price' => $customer['package_price'],
                    'status' => $customer['status'],
                ],
            );
        }
    }
}
