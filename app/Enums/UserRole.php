<?php

namespace App\Enums;

/**
 * Application user roles.
 *
 * Administrator: full access (manage users, customers, invoices, delete data).
 * Staff: limited access (view/create/update customers, view invoices).
 */
enum UserRole: string
{
    case Administrator = 'administrator';
    case Staff = 'staff';

    /**
     * Human-readable label used in the UI.
     */
    public function label(): string
    {
        return match ($this) {
            self::Administrator => 'Administrator',
            self::Staff => 'Staff',
        };
    }
}
