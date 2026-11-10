<?php

namespace App\Enums;

/**
 * Status pelanggan layanan internet.
 */
enum CustomerStatus: string
{
    case Active = 'active';
    case Suspend = 'suspend';
    case Disconnected = 'disconnected';

    /**
     * Label yang ditampilkan di UI.
     */
    public function label(): string
    {
        return match ($this) {
            self::Active => 'Aktif',
            self::Suspend => 'Suspend',
            self::Disconnected => 'Putus',
        };
    }
}
