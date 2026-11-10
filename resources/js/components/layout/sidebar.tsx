import { navigationForRole, type NavItem } from '@/config/navigation';
import { cn } from '@/lib/utils';
import type { Auth, UserRole } from '@/types/auth';
import { Link, usePage } from '@inertiajs/react';
import { LogOut, Shield, Sparkles, Wifi, X } from 'lucide-react';

type SidebarProps = {
    open: boolean;
    onClose: () => void;
};

/**
 * Sidebar modern dengan grouping nav, status ISP, card akun pengguna, dan highlight aktif.
 */
export default function Sidebar({ open, onClose }: SidebarProps) {
    const { auth } = usePage<{ auth?: Auth }>().props;
    const user = auth?.user;
    const role = (user?.role ?? 'staff') as UserRole;
    const items = navigationForRole(role);
    const currentUrl = usePage().url;

    // Pisahkan Menu Utama vs Administrasi
    const mainItems = items.filter((i) => !i.adminOnly);
    const adminItems = items.filter((i) => i.adminOnly);

    return (
        <>
            {/* Mobile overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-200 transition-transform duration-200 lg:translate-x-0',
                    open ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                {/* Brand */}
                <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-5">
                    <Link
                        href="/dashboard"
                        className="group flex items-center gap-3"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md shadow-blue-500/25 transition-transform group-hover:scale-105">
                            <Wifi className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <span className="block text-sm font-bold tracking-tight text-white">
                                Management ISP
                            </span>
                            <span className="flex items-center gap-1.5 text-[10px] font-medium text-blue-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                Billing & Client
                            </span>
                        </div>
                    </Link>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
                        aria-label="Tutup menu"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-6 overflow-y-auto px-3.5 py-5">
                    <div>
                        <p className="px-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                            Menu Utama
                        </p>
                        <div className="mt-2 space-y-1">
                            {mainItems.map((item) => (
                                <SidebarLink
                                    key={item.href}
                                    item={item}
                                    active={isActive(currentUrl, item.href)}
                                />
                            ))}
                        </div>
                    </div>

                    {adminItems.length > 0 && (
                        <div>
                            <p className="flex items-center gap-1.5 px-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                                <Shield className="h-3 w-3 text-indigo-400" />
                                Administrasi
                            </p>
                            <div className="mt-2 space-y-1">
                                {adminItems.map((item) => (
                                    <SidebarLink
                                        key={item.href}
                                        item={item}
                                        active={isActive(currentUrl, item.href)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Pro feature / Network hint badge */}
                    <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-blue-950/40 p-3.5">
                        <div className="flex items-center gap-2 text-xs font-semibold text-blue-300">
                            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                            ISP Network Hub
                        </div>
                        <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                            Kelola pelanggan & tagihan secara real-time dari
                            database.
                        </p>
                    </div>
                </nav>

                {/* User card & Logout footer */}
                <div className="border-t border-slate-800/80 p-3">
                    <Link
                        href="/profil"
                        className="group flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-slate-800/70"
                    >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-xs">
                            {initials(user?.name ?? 'Admin')}
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-white group-hover:text-blue-300">
                                {user?.name ?? 'Administrator'}
                            </p>
                            <p className="truncate text-[11px] text-slate-400">
                                {role === 'administrator'
                                    ? 'Administrator'
                                    : 'Staff ISP'}
                            </p>
                        </div>
                    </Link>

                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        Keluar dari Sistem
                    </Link>
                </div>
            </aside>
        </>
    );
}

function SidebarLink({ item, active }: { item: NavItem; active: boolean }) {
    return (
        <Link
            href={item.href}
            className={cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-150',
                active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white',
            )}
        >
            <item.icon
                className={cn(
                    'h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-110',
                    active
                        ? 'text-white'
                        : 'text-slate-400 group-hover:text-slate-200',
                )}
            />
            <span>{item.label}</span>
            {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white shadow-xs" />
            )}
        </Link>
    );
}

function isActive(currentUrl: string, href: string): boolean {
    if (href === '/') return currentUrl === '/';
    return currentUrl === href || currentUrl.startsWith(`${href}/`);
}

function initials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();
}
