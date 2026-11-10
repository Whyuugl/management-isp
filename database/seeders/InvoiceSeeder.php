<?php

namespace Database\Seeders;

use App\Enums\PaymentStatus;
use App\Models\Customer;
use App\Models\Invoice;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

/**
 * Seeder data tagihan contoh.
 * Idempotent: kunci unik logis = kombinasi customer + periode tagihan.
 */
class InvoiceSeeder extends Seeder
{
    /**
     * Tagihan contoh dengan status unpaid & paid.
     *
     * @var array<int, array{phone: string, billing_period: string, amount: int, payment_status: PaymentStatus, paid_at: string|null}>
     */
    private array $invoices = [
        [
            'phone' => '081234567890',
            'billing_period' => '2026-11-01',
            'amount' => 300000,
            'payment_status' => PaymentStatus::Unpaid,
            'paid_at' => null,
        ],
        [
            'phone' => '081322223333',
            'billing_period' => '2026-11-01',
            'amount' => 250000,
            'payment_status' => PaymentStatus::Paid,
            'paid_at' => '2026-11-05 10:15:00',
        ],
        [
            'phone' => '0215551234',
            'billing_period' => '2026-11-01',
            'amount' => 1200000,
            'payment_status' => PaymentStatus::Unpaid,
            'paid_at' => null,
        ],
        [
            'phone' => '085711112222',
            'billing_period' => '2026-10-01',
            'amount' => 350000,
            'payment_status' => PaymentStatus::Unpaid,
            'paid_at' => null,
        ],
        [
            'phone' => '081944445555',
            'billing_period' => '2026-10-01',
            'amount' => 250000,
            'payment_status' => PaymentStatus::Paid,
            'paid_at' => '2026-10-08 09:45:00',
        ],
        [
            'phone' => '081234567890',
            'billing_period' => '2026-10-01',
            'amount' => 300000,
            'payment_status' => PaymentStatus::Paid,
            'paid_at' => '2026-10-04 08:10:00',
        ],
        [
            'phone' => '081399990000',
            'billing_period' => '2026-09-01',
            'amount' => 350000,
            'payment_status' => PaymentStatus::Paid,
            'paid_at' => '2026-09-06 11:00:00',
        ],
        [
            'phone' => '081277778888',
            'billing_period' => '2026-10-01',
            'amount' => 300000,
            'payment_status' => PaymentStatus::Paid,
            'paid_at' => '2026-10-12 13:20:00',
        ],
    ];

    /**
     * Jalankan seeder tagihan.
     */
    public function run(): void
    {
        foreach ($this->invoices as $invoice) {
            $customer = Customer::where('phone', $invoice['phone'])->first();

            if ($customer === null) {
                continue;
            }

            Invoice::updateOrCreate(
                [
                    'customer_id' => $customer->id,
                    'billing_period' => $invoice['billing_period'],
                ],
                [
                    'amount' => $invoice['amount'],
                    'payment_status' => $invoice['payment_status'],
                    'paid_at' => $invoice['paid_at']
                        ? Carbon::parse($invoice['paid_at'])
                        : null,
                ],
            );
        }
    }
}
