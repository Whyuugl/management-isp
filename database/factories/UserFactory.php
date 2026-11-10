<?php

namespace Database\Factories;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Factory untuk model User.
 * Default role: Staff.
 *
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * Password yang di-cache agar hashing tidak dipanggil berulang kali.
     */
    protected static ?string $password;

    /**
     * Definisi state default.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'role' => UserRole::Staff,
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * State untuk pengguna dengan role Administrator.
     */
    public function administrator(): static
    {
        return $this->state(fn () => [
            'role' => UserRole::Administrator,
        ]);
    }

    /**
     * State untuk pengguna dengan role Staff.
     */
    public function staff(): static
    {
        return $this->state(fn () => [
            'role' => UserRole::Staff,
        ]);
    }

    /**
     * State email belum terverifikasi.
     */
    public function unverified(): static
    {
        return $this->state(fn () => [
            'email_verified_at' => null,
        ]);
    }
}
