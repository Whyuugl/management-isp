<?php

namespace Database\Factories;

use App\Enums\PaymentStatus;
use App\Models\Customer;
use App\Models\Invoice;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory untuk model Invoice.
 * Default status: Unpaid, paid_at null.
 * Untuk status Paid gunakan state paid().
 *
 * @extends Factory<Invoice>
 */
class InvoiceFactory extends Factory
{
    /**
     * Definisi state default.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_id' => Customer::factory(),
            'billing_period' => fake()->dateTimeBetween('-6 months', 'now')->format('Y-m-d'),
            'amount' => fake()->randomElement([250000, 300000, 350000, 1200000]),
            'payment_status' => PaymentStatus::Unpaid,
            'paid_at' => null,
        ];
    }

    /**
     * State tagihan lunas dengan tanggal pembayaran.
     */
    public function paid(): static
    {
        return $this->state(fn () => [
            'payment_status' => PaymentStatus::Paid,
            'paid_at' => fake()->dateTimeBetween('-6 months', 'now'),
        ]);
    }
}
