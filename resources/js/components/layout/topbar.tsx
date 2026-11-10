import Dropdown, { DropdownItem } from '@/components/ui/dropdown';
import type { Auth } from '@/types/auth';
import { router, usePage } from '@inertiajs/react';
import { ChevronDown, LogOut, Menu, Settings, User } from 'lucide-react';

type TopbarProps = {
    onMenuClick: () => void;
};

/**
 * Topbar header aplikasi dengan styling modern, avatar glow, role pill, dan dropdown fungsional.
 */
export default function Topbar({ onMenuClick }: TopbarProps) {
    const { auth } = usePage<{ auth?: Auth }>().props;
    const user = auth?.user;
    const isAdministrator = user?.role === 'administrator';

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md lg:px-6">
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 lg:hidden"
                    aria-label="Menu"
                >
                    <Menu className="h-5 w-5" />
                </button>

                <div className="hidden lg:flex lg:items-center lg:gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                    <span className="text-xs font-medium text-slate-500">
                        Sistem Online
                    </span>
                </div>
            </div>

            {/* User dropdown */}
            <Dropdown
                trigger={
                    <button
                        type="button"
                        className="group flex items-center gap-3 rounded-full border border-slate-200/80 bg-slate-50/60 py-1 pr-3 pl-1.5 transition-all duration-150 hover:border-slate-300 hover:bg-white hover:shadow-xs"
                    >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-xs">
                            {initials(user?.name ?? 'Administrator')}
                        </span>
                        <div className="hidden text-left sm:block">
                            <p className="text-xs font-semibold text-slate-800 group-hover:text-slate-900">
                                {user?.name ?? 'Administrator'}
                            </p>
                            <p className="text-[10px] font-medium text-slate-400">
                                {isAdministrator ? 'Administrator' : 'Staff'}
                            </p>
                        </div>
                        <ChevronDown className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:text-slate-600" />
                    </button>
                }
            >
                {/* Header dropdown info */}
                <div className="border-b border-slate-100 px-3.5 py-2.5">
                    <p className="text-xs font-semibold text-slate-900">
                        {user?.name ?? 'Administrator'}
                    </p>
                    <p className="truncate text-[11px] text-slate-500">
                        {user?.email ?? 'Belum masuk'}
                    </p>
                    <span className="mt-1.5 inline-flex items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
                        {isAdministrator ? 'Administrator' : 'Staff'}
                    </span>
                </div>

                <div className="py-1">
                    <DropdownItem href="/profil">
                        <User className="h-4 w-4 text-slate-400" />
                        Profil Akun
                    </DropdownItem>
                    <DropdownItem href="/pengaturan">
                        <Settings className="h-4 w-4 text-slate-400" />
                        Pengaturan
                    </DropdownItem>
                </div>

                <div className="border-t border-slate-100 pt-1">
                    <DropdownItem danger onClick={() => router.post('/logout')}>
                        <LogOut className="h-4 w-4" />
                        Keluar
                    </DropdownItem>
                </div>
            </Dropdown>
        </header>
    );
}

function initials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();
}
