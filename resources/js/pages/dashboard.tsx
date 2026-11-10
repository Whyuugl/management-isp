import { Card } from '@/components/ui';
import { PageHeader, StatCard } from '@/components/common';
import MonthlyInvoiceChart from '@/components/dashboard/monthly-invoice-chart';
import UnpaidInvoicesPanel, {
    type UnpaidInvoiceItem,
} from '@/components/dashboard/unpaid-invoices-panel';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, usePage } from '@inertiajs/react';
import {
    BadgeCheck,
    BarChart3,
    CalendarDays,
    FileWarning,
    UserMinus,
    UserX,
    Users,
} from 'lucide-react';

export type DashboardStats = {
    totalCustomers: number;
    activeCustomers: number;
    suspendedCustomers: number;
    disconnectedCustomers: number;
    totalUnpaidInvoices: number;
};

export type MonthlyInvoiceItem = {
    month: string;
    count: number;
};

type DashboardProps = {
    stats: DashboardStats;
    monthlyInvoiceData: MonthlyInvoiceItem[];
    unpaidInvoices: UnpaidInvoiceItem[];
};

export default function Dashboard({
    stats,
    monthlyInvoiceData,
    unpaidInvoices,
}: DashboardProps) {
    const { auth } = usePage<{ auth?: { user?: { name?: string } } }>().props;

    const today = new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date());

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <PageHeader
                title="Dashboard"
                description="Ringkasan performa layanan internet Anda."
            />

            {/* Banner Sambutan dengan gradient */}
            <div className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-blue-900 p-6 sm:p-8">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-24 right-10 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />
                    <div className="absolute -bottom-20 left-16 h-44 w-44 rounded-full bg-indigo-400/10 blur-3xl" />
                </div>

                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="flex items-center gap-2 text-xs font-medium text-blue-200/80">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {today}
                        </p>
                        <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                            Selamat datang kembali,
                            <span className="ml-2 text-blue-300">
                                {auth?.user?.name ?? 'Administrator'}
                            </span>
                        </h2>
                        <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-300">
                            Pantau kondisi pelanggan, tagihan, dan pertumbuhan
                            bisnis dalam satu pandangan.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center backdrop-blur-sm">
                            <p className="text-2xl font-bold text-white">
                                {stats.totalCustomers.toLocaleString('id-ID')}
                            </p>
                            <p className="mt-0.5 text-[11px] font-medium text-blue-200/80">
                                Pelanggan
                            </p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center backdrop-blur-sm">
                            <p className="text-2xl font-bold text-white">
                                {stats.totalUnpaidInvoices.toLocaleString(
                                    'id-ID',
                                )}
                            </p>
                            <p className="mt-0.5 text-[11px] font-medium text-amber-200/90">
                                Tagihan Tertunggak
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5 Statistik Utama */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <StatCard
                    label="Total Pelanggan"
                    value={stats.totalCustomers.toLocaleString('id-ID')}
                    icon={Users}
                    color="blue"
                    description="Seluruh pelanggan terdaftar"
                />
                <StatCard
                    label="Pelanggan Aktif"
                    value={stats.activeCustomers.toLocaleString('id-ID')}
                    icon={BadgeCheck}
                    color="emerald"
                    description="Layanan berjalan normal"
                />
                <StatCard
                    label="Pelanggan Suspend"
                    value={stats.suspendedCustomers.toLocaleString('id-ID')}
                    icon={UserX}
                    color="amber"
                    description="Layanan ditangguhkan"
                />
                <StatCard
                    label="Pelanggan Putus"
                    value={stats.disconnectedCustomers.toLocaleString('id-ID')}
                    icon={UserMinus}
                    color="rose"
                    description="Berhenti berlangganan"
                />
                <StatCard
                    label="Tagihan Belum Bayar"
                    value={stats.totalUnpaidInvoices.toLocaleString('id-ID')}
                    icon={FileWarning}
                    color="indigo"
                    description="Menunggu pembayaran"
                />
            </div>

            {/* Grafik + Panel Tagihan Belum Bayar */}
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <div className="mb-5 flex items-start justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/10">
                                <BarChart3 className="h-5 w-5" />
                            </span>
                            <div>
                                <h2 className="text-base font-semibold text-slate-900">
                                    Jumlah Tagihan Per Bulan
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Tren tagihan bulanan dari data historis
                                </p>
                            </div>
                        </div>
                    </div>
                    <MonthlyInvoiceChart data={monthlyInvoiceData} />
                </Card>

                <Card>
                    <UnpaidInvoicesPanel invoices={unpaidInvoices} />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
