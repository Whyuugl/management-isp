<?php

namespace Database\Factories;

use App\Enums\CustomerStatus;
use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Factory untuk model Customer.
 * Default status: Active.
 *
 * @extends Factory<Customer>
 */
class CustomerFactory extends Factory
{
    /**
     * Definisi state default.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'phone' => fake()->phoneNumber(),
            'address' => fake()->address(),
            'internet_package' => fake()->randomElement([
                'Home 20 Mbps',
                'Home 30 Mbps',
                'Home 50 Mbps',
                'Business 100 Mbps',
            ]),
            'package_price' => fake()->randomElement([250000, 300000, 350000, 1200000]),
            'status' => CustomerStatus::Active,
        ];
    }

    /**
     * State pelanggan berstatus Suspend.
     */
    public function suspended(): static
    {
        return $this->state(fn () => [
            'status' => CustomerStatus::Suspend,
        ]);
    }

    /**
     * State pelanggan berstatus Disconnected (Putus).
     */
    public function disconnected(): static
    {
        return $this->state(fn () => [
            'status' => CustomerStatus::Disconnected,
        ]);
    }
}
