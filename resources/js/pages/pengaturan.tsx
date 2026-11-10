import PasswordForm from '@/components/account/password-form';
import { PageHeader } from '@/components/common';
import { Card } from '@/components/ui';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowUpRight,
    CircleCheck,
    Database,
    ReceiptText,
    Server,
    Shield,
    UserCheck,
    UserRoundCog,
    Users,
} from 'lucide-react';

type SettingsUser = {
    id: number;
    name: string;
    email: string;
    roleLabel: string;
    isAdministrator: boolean;
    createdAt: string;
};

type PengaturanPageProps = {
    user: SettingsUser;
};

/**
 * Halaman Pengaturan: preferensi akun, keamanan kredensial, dan informasi sistem ISP.
 */
export default function Pengaturan({ user }: PengaturanPageProps) {
    return (
        <AuthenticatedLayout>
            <Head title="Pengaturan" />

            <PageHeader
                title="Pengaturan"
                description="Kelola preferensi akun, keamanan password, dan akses modul sistem."
            />

            <div className="mt-6 space-y-6">
                {/* Form Keamanan / Ganti Password */}
                <Card>
                    <PasswordForm />
                </Card>

                {/* Grid 2 kolom: Info Sistem & Tautan Cepat */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Ringkasan Hak Akses & Status Sistem */}
                    <Card>
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                <Server className="h-4 w-4" />
                            </span>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900">
                                    Informasi Sistem & Akses
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Status koneksi database dan hak akses Anda
                                    saat ini.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 space-y-3 text-xs">
                            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5">
                                <span className="flex items-center gap-2 font-medium text-slate-600">
                                    <Database className="h-4 w-4 text-slate-400" />
                                    Database ISP
                                </span>
                                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                                    <CircleCheck className="h-3.5 w-3.5" />
                                    MySQL Connected
                                </span>
                            </div>

                            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5">
                                <span className="flex items-center gap-2 font-medium text-slate-600">
                                    <Shield className="h-4 w-4 text-slate-400" />
                                    Tingkat Akses
                                </span>
                                <span className="font-semibold text-slate-900">
                                    {user.roleLabel}
                                </span>
                            </div>

                            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5">
                                <span className="flex items-center gap-2 font-medium text-slate-600">
                                    <UserCheck className="h-4 w-4 text-slate-400" />
                                    ID Pengguna
                                </span>
                                <span className="font-mono text-slate-700">
                                    #{user.id} ({user.email})
                                </span>
                            </div>
                        </div>
                    </Card>

                    {/* Tautan Cepat Administrasi */}
                    <Card>
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                <ArrowUpRight className="h-4 w-4" />
                            </span>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900">
                                    Pintasan Cepat
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Navigasi cepat ke modul operasional penting.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            {user.isAdministrator && (
                                <Link
                                    href="/users"
                                    className="group flex items-center justify-between rounded-xl border border-slate-200/80 p-3 text-xs font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700"
                                >
                                    <span className="flex items-center gap-2.5">
                                        <UserRoundCog className="h-4 w-4 text-indigo-600" />
                                        Kelola Pengguna Sistem
                                    </span>
                                    <span className="text-[11px] font-normal text-slate-400 group-hover:text-blue-600">
                                        Akses Administrator →
                                    </span>
                                </Link>
                            )}

                            <Link
                                href="/pelanggan"
                                className="group flex items-center justify-between rounded-xl border border-slate-200/80 p-3 text-xs font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700"
                            >
                                <span className="flex items-center gap-2.5">
                                    <Users className="h-4 w-4 text-blue-600" />
                                    Data Pelanggan Internet
                                </span>
                                <span className="text-[11px] font-normal text-slate-400 group-hover:text-blue-600">
                                    Buka Modul →
                                </span>
                            </Link>

                            <Link
                                href="/tagihan"
                                className="group flex items-center justify-between rounded-xl border border-slate-200/80 p-3 text-xs font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700"
                            >
                                <span className="flex items-center gap-2.5">
                                    <ReceiptText className="h-4 w-4 text-emerald-600" />
                                    Kelola Tagihan & Pembayaran
                                </span>
                                <span className="text-[11px] font-normal text-slate-400 group-hover:text-blue-600">
                                    Buka Modul →
                                </span>
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
