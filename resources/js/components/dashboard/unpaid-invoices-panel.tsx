import { formatBillingPeriod, formatRupiah } from '@/lib/format';
import { AlertCircle, ArrowRight, Receipt } from 'lucide-react';
import { Link } from '@inertiajs/react';

export type UnpaidInvoiceItem = {
    id: string;
    customer_name: string;
    billing_period: string;
    amount: number;
};

type UnpaidInvoicesPanelProps = {
    invoices: UnpaidInvoiceItem[];
};

/**
 * Panel daftar tagihan belum bayar dengan card per baris & hover halus.
 */
export default function UnpaidInvoicesPanel({
    invoices,
}: UnpaidInvoicesPanelProps) {
    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 shadow-sm shadow-amber-500/10">
                        <AlertCircle className="h-4 w-4" />
                    </span>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-900">
                            Tagihan Belum Bayar
                        </h3>
                        <p className="text-xs text-slate-500">
                            {invoices.length > 0
                                ? `${invoices.length} tagihan menunggu pembayaran`
                                : 'Semua tagihan lunas'}
                        </p>
                    </div>
                </div>

                <span className="inline-flex items-center rounded-full bg-amber-100/70 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                    {invoices.length} tertunda
                </span>
            </div>

            {invoices.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <Receipt className="h-6 w-6" />
                    </div>
                    <p className="mt-3 text-sm font-medium text-slate-700">
                        Tidak ada tagihan tertunggak
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                        Semua pelanggan telah melunasi tagihannya.
                    </p>
                </div>
            ) : (
                <ul className="mt-3 flex-1 space-y-2">
                    {invoices.map((invoice) => (
                        <li
                            key={invoice.id}
                            className="group flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition-colors hover:border-slate-200 hover:bg-white hover:shadow-xs"
                        >
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-900">
                                    {invoice.customer_name}
                                </p>
                                <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                                    <span>
                                        {formatBillingPeriod(
                                            invoice.billing_period,
                                        )}
                                    </span>
                                    <span>•</span>
                                    <span className="font-mono text-[11px] text-slate-400">
                                        {invoice.id}
                                    </span>
                                </div>
                            </div>
                            <span className="shrink-0 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                                {formatRupiah(invoice.amount)}
                            </span>
                        </li>
                    ))}
                </ul>
            )}

            {invoices.length > 0 && (
                <div className="border-t border-slate-100 pt-3">
                    <Link
                        href="/tagihan"
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                    >
                        Kelola di Menu Tagihan
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            )}
        </div>
    );
}
