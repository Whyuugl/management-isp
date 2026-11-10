import {
    LayoutDashboard,
    ReceiptText,
    UserRoundCog,
    Users,
    type LucideIcon,
} from 'lucide-react';

import type { UserRole } from '@/types/auth';

export type NavItem = {
    label: string;
    href: string;
    icon: LucideIcon;
    adminOnly?: boolean;
};

export const navigation: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Pelanggan', href: '/pelanggan', icon: Users },
    { label: 'Tagihan', href: '/tagihan', icon: ReceiptText },
    {
        label: 'Manajemen User',
        href: '/users',
        icon: UserRoundCog,
        adminOnly: true,
    },
];

/**
 * Frontend navigation only. Server authorization must still guard every route.
 */
export function navigationForRole(role: UserRole = 'administrator'): NavItem[] {
    return navigation.filter(
        (item) => !item.adminOnly || role === 'administrator',
    );
}
