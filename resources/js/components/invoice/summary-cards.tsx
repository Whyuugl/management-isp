import { cn } from '@/lib/utils';
import { formatRupiah } from '@/lib/format';
import type { LucideIcon } from 'lucide-react';
import { CheckCircle2, Clock, FileText, Wallet } from 'lucide-react';

/**
 * Kartu ringkasan tagihan: total, belum bayar, lunas, dan nominal tertunggak.
 */
export default function InvoiceSummaryCards({
    total,
    unpaid,
    paid,
    unpaidAmount,
}: {
    total: number;
    unpaid: number;
    paid: number;
    unpaidAmount: number;
}) {
    const items: {
        title: string;
        value: string | number;
        icon: LucideIcon;
        bg: string;
        iconBg: string;
    }[] = [
        {
            title: 'Total Tagihan',
            value: total,
            icon: FileText,
            bg: 'from-blue-50/40 to-white hover:border-blue-200',
            iconBg: 'bg-blue-600 text-white shadow-sm shadow-blue-500/20',
        },
        {
            title: 'Belum Bayar',
            value: unpaid,
            icon: Clock,
            bg: 'from-amber-50/40 to-white hover:border-amber-200',
            iconBg: 'bg-amber-500 text-white shadow-sm shadow-amber-500/20',
        },
        {
            title: 'Lunas',
            value: paid,
            icon: CheckCircle2,
            bg: 'from-emerald-50/40 to-white hover:border-emerald-200',
            iconBg: 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20',
        },
        {
            title: 'Total Nominal Belum Dibayar',
            value: formatRupiah(unpaidAmount),
            icon: Wallet,
            bg: 'from-rose-50/40 to-white hover:border-rose-200',
            iconBg: 'bg-rose-500 text-white shadow-sm shadow-rose-500/20',
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
                <div
                    key={item.title}
                    className={cn(
                        'flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-gradient-to-b p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
                        item.bg,
                    )}
                >
                    <div
                        className={cn(
                            'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                            item.iconBg,
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-slate-500">
                            {item.title}
                        </p>
                        <p className="truncate text-xl font-bold tracking-tight text-slate-900">
                            {typeof item.value === 'number'
                                ? item.value.toLocaleString('id-ID')
                                : item.value}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
