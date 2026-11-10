import DataTable, { type Column } from '@/components/table/data-table';
import { Button } from '@/components/ui';
import InvoiceStatusBadge from '@/components/invoice/status-badge';
import type { Invoice } from '@/types/invoice';
import {
    formatBillingPeriod,
    formatDateTime,
    formatRupiah,
} from '@/lib/format';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    CheckCircle,
    Eye,
} from 'lucide-react';

export type InvoiceSortKey =
    | 'customer_name'
    | 'billing_period'
    | 'amount'
    | 'payment_status'
    | 'paid_at';

export type InvoiceSortDirection = 'asc' | 'desc';

type InvoiceTableProps = {
    invoices: Invoice[];
    loading?: boolean;
    sortKey: InvoiceSortKey;
    sortDirection: InvoiceSortDirection;
    onSortChange: (key: InvoiceSortKey) => void;
    onPay: (invoice: Invoice) => void;
    onView: (invoice: Invoice) => void;
    canPay?: boolean;
    emptyMessage?: string;
};

/**
 * Tabel daftar tagihan.
 * Kolom: Pelanggan, Periode Tagihan, Nominal, Status Pembayaran, Tanggal Pembayaran, Aksi.
 * Fitur: Sortable, skeleton loading, empty state, action Bayar / Detail.
 */
export default function InvoiceTable({
    invoices,
    loading = false,
    sortKey,
    sortDirection,
    onSortChange,
    onPay,
    onView,
    canPay = true,
    emptyMessage = 'Tidak ada tagihan',
}: InvoiceTableProps) {
    function sortableHeader(key: InvoiceSortKey, label: string) {
        return (
            <button
                type="button"
                onClick={() => onSortChange(key)}
                className="flex items-center gap-1 hover:text-slate-700"
            >
                {label}
                {sortKey === key ? (
                    sortDirection === 'asc' ? (
                        <ArrowUp className="h-3.5 w-3.5" />
                    ) : (
                        <ArrowDown className="h-3.5 w-3.5" />
                    )
                ) : (
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-300" />
                )}
            </button>
        );
    }

    const columns: Column<Invoice>[] = [
        {
            key: 'customer_name',
            header: sortableHeader('customer_name', 'Pelanggan'),
            render: (inv) => (
                <div>
                    <p className="font-medium text-slate-900">
                        {inv.customer_name}
                    </p>
                    <p className="font-mono text-xs text-slate-400">{inv.id}</p>
                </div>
            ),
        },
        {
            key: 'billing_period',
            header: sortableHeader('billing_period', 'Periode Tagihan'),
            render: (inv) => (
                <span className="text-sm text-slate-700">
                    {formatBillingPeriod(inv.billing_period)}
                </span>
            ),
        },
        {
            key: 'amount',
            header: sortableHeader('amount', 'Nominal'),
            render: (inv) => (
                <span className="font-medium text-slate-900">
                    {formatRupiah(inv.amount)}
                </span>
            ),
        },
        {
            key: 'payment_status',
            header: sortableHeader('payment_status', 'Status Pembayaran'),
            render: (inv) => <InvoiceStatusBadge status={inv.payment_status} />,
        },
        {
            key: 'paid_at',
            header: sortableHeader('paid_at', 'Tanggal Pembayaran'),
            render: (inv) => (
                <span className="text-xs text-slate-500">
                    {formatDateTime(inv.paid_at)}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Aksi',
            render: (inv) => (
                <div className="flex items-center gap-2">
                    {canPay && inv.payment_status === 'unpaid' ? (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => onPay(inv)}
                            aria-label={`Bayar tagihan ${inv.id}`}
                        >
                            <CheckCircle className="h-3.5 w-3.5" />
                            Bayar
                        </Button>
                    ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                            <CheckCircle className="h-3.5 w-3.5" />
                            Lunas
                        </span>
                    )}
                    {!canPay && inv.payment_status === 'unpaid' && (
                        <span className="text-xs text-slate-400">
                            Belum Bayar
                        </span>
                    )}

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(inv)}
                        aria-label={`Lihat detail tagihan ${inv.id}`}
                    >
                        <Eye className="h-3.5 w-3.5" />
                        Detail
                    </Button>
                </div>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="space-y-3 p-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex animate-pulse gap-4">
                        <div className="h-4 w-1/4 rounded bg-slate-200" />
                        <div className="h-4 w-1/5 rounded bg-slate-200" />
                        <div className="h-4 w-1/6 rounded bg-slate-200" />
                        <div className="h-4 w-1/6 rounded bg-slate-200" />
                        <div className="h-4 w-1/5 rounded bg-slate-200" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <DataTable
            columns={columns}
            data={invoices}
            keyExtractor={(inv) => inv.id}
            emptyMessage={emptyMessage}
        />
    );
}
