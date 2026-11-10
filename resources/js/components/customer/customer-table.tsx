import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Eye,
    Pencil,
    Trash2,
} from 'lucide-react';
import DataTable, { type Column } from '@/components/table/data-table';
import { Button } from '@/components/ui';
import CustomerStatusBadge from '@/components/customer/status-badge';
import type { Customer } from '@/types/customer';

export type SortKey = 'name' | 'phone' | 'package' | 'price' | 'status';

export type SortDirection = 'asc' | 'desc';

export type CustomerTableProps = {
    customers: Customer[];
    loading: boolean;
    emptyMessage?: string;
    sortKey: SortKey;
    sortDirection: SortDirection;
    onSortChange: (key: SortKey) => void;
    onView: (customer: Customer) => void;
    onEdit: (customer: Customer) => void;
    onDelete: (customer: Customer) => void;
    canDelete?: boolean;
};

/**
 * Tabel daftar pelanggan.
 * Mendukung sorting kolom, empty state, loading state (skeleton row).
 */
export default function CustomerTable({
    customers,
    loading,
    emptyMessage = 'Tidak ada pelanggan',
    sortKey,
    sortDirection,
    onSortChange,
    onView,
    onEdit,
    onDelete,
    canDelete = true,
}: CustomerTableProps) {
    function sortableHeader(key: SortKey, label: string) {
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

    const columns: Column<Customer>[] = [
        {
            key: 'name',
            header: sortableHeader('name', 'Nama Pelanggan'),
            render: (customer) => (
                <div>
                    <p className="font-medium text-slate-900">
                        {customer.name}
                    </p>
                    <p className="text-xs text-slate-500">{customer.address}</p>
                </div>
            ),
        },
        {
            key: 'phone',
            header: sortableHeader('phone', 'Nomor Telepon'),
            render: (customer) => (
                <span className="font-mono text-xs text-slate-600">
                    {customer.phone}
                </span>
            ),
        },
        {
            key: 'package',
            header: sortableHeader('package', 'Paket Internet'),
            render: (customer) => (
                <span className="text-sm text-slate-900">
                    {customer.package}
                </span>
            ),
        },
        {
            key: 'price',
            header: sortableHeader('price', 'Harga Paket'),
            render: (customer) => (
                <span className="font-medium text-slate-900">
                    Rp {customer.price.toLocaleString('id-ID')}
                </span>
            ),
        },
        {
            key: 'status',
            header: sortableHeader('status', 'Status'),
            render: (customer) => (
                <CustomerStatusBadge status={customer.status} />
            ),
        },
        {
            key: 'actions',
            header: 'Aksi',
            render: (customer) => (
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(customer)}
                        aria-label={`Lihat detail ${customer.name}`}
                    >
                        <Eye className="h-3.5 w-3.5" />
                        Detail
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(customer)}
                        aria-label={`Edit ${customer.name}`}
                    >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                    </Button>
                    {canDelete && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => onDelete(customer)}
                            aria-label={`Hapus ${customer.name}`}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Hapus
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex animate-pulse gap-4">
                        <div className="h-4 w-1/4 rounded bg-slate-200" />
                        <div className="h-4 w-1/6 rounded bg-slate-200" />
                        <div className="h-4 w-1/5 rounded bg-slate-200" />
                        <div className="h-4 w-1/6 rounded bg-slate-200" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <DataTable
            columns={columns}
            data={customers}
            keyExtractor={(customer) => customer.id}
            emptyMessage={emptyMessage}
        />
    );
}
