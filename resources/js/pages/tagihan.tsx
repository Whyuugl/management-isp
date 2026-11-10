import { PageHeader } from '@/components/common';
import InvoiceDetailDialog from '@/components/invoice/invoice-detail-dialog';
import InvoiceFilters from '@/components/invoice/filters';
import InvoiceForm, {
    type InvoiceFormValues,
} from '@/components/invoice/invoice-form';
import InvoicePaymentDialog from '@/components/invoice/invoice-payment-dialog';
import InvoiceSummaryCards from '@/components/invoice/summary-cards';
import InvoiceTable, {
    type InvoiceSortDirection,
    type InvoiceSortKey,
} from '@/components/invoice/invoice-table';
import Pagination from '@/components/table/pagination';
import { Button, Card } from '@/components/ui';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { formatBillingPeriod } from '@/lib/format';
import type { Auth } from '@/types/auth';
import type { Customer } from '@/types/customer';
import type { Invoice } from '@/types/invoice';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

const PAGE_SIZE = 5;

type InvoiceSummary = {
    total: number;
    unpaid: number;
    paid: number;
    unpaidAmount: number;
};

type TagihanPageProps = {
    invoices: Invoice[];
    summary: InvoiceSummary;
    customers: Customer[];
};

/**
 * Halaman Manajemen Tagihan — data dan mutasi tersambung ke MySQL.
 */
export default function Tagihan({
    invoices,
    summary,
    customers,
}: TagihanPageProps) {
    const { auth } = usePage<{ auth?: Auth }>().props;
    const isAdministrator = auth?.user?.role === 'administrator';

    // Filter & Sort di client atas dataset database
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [periodFilter, setPeriodFilter] = useState('');
    const [sortKey, setSortKey] = useState<InvoiceSortKey>('billing_period');
    const [sortDirection, setSortDirection] =
        useState<InvoiceSortDirection>('desc');
    const [page, setPage] = useState(1);

    // Dialog state
    const [formOpen, setFormOpen] = useState(false);
    const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
    const [detailInvoice, setDetailInvoice] = useState<Invoice | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Opsi periode tagihan unik dari dataset
    const periodOptions = useMemo(() => {
        const unique = Array.from(
            new Set(invoices.map((inv) => inv.billing_period)),
        ).sort((a, b) => b.localeCompare(a));

        return unique.map((p) => ({
            value: p,
            label: formatBillingPeriod(p),
        }));
    }, [invoices]);

    // Filtering
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();

        return invoices.filter((inv) => {
            const matchesSearch =
                q === '' ||
                inv.customer_name.toLowerCase().includes(q) ||
                inv.id.toLowerCase().includes(q);

            const matchesStatus =
                statusFilter === '' || inv.payment_status === statusFilter;

            const matchesPeriod =
                periodFilter === '' || inv.billing_period === periodFilter;

            return matchesSearch && matchesStatus && matchesPeriod;
        });
    }, [invoices, search, statusFilter, periodFilter]);

    // Sorting
    const sorted = useMemo(() => {
        const list = [...filtered];

        list.sort((a, b) => {
            let res = 0;
            switch (sortKey) {
                case 'customer_name':
                    res = a.customer_name.localeCompare(b.customer_name, 'id');
                    break;
                case 'billing_period':
                    res = a.billing_period.localeCompare(b.billing_period);
                    break;
                case 'amount':
                    res = a.amount - b.amount;
                    break;
                case 'payment_status':
                    res = a.payment_status.localeCompare(b.payment_status);
                    break;
                case 'paid_at':
                    res = (a.paid_at ?? '').localeCompare(b.paid_at ?? '');
                    break;
            }
            return sortDirection === 'asc' ? res : -res;
        });

        return list;
    }, [filtered, sortKey, sortDirection]);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const paginated = useMemo(() => {
        const start = (safePage - 1) * PAGE_SIZE;
        return sorted.slice(start, start + PAGE_SIZE);
    }, [sorted, safePage]);

    function handleSortChange(key: InvoiceSortKey): void {
        if (sortKey === key) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    }

    // Tambah Tagihan Baru ke Database (POST /tagihan)
    function handleCreateInvoice(values: InvoiceFormValues): void {
        setSubmitting(true);

        router.post(
            '/tagihan',
            {
                customer_id: Number(values.customer_id),
                billing_period: values.billing_period,
                amount: Number(values.amount) || 0,
            },
            {
                preserveScroll: true,
                onSuccess: () => setFormOpen(false),
                onFinish: () => setSubmitting(false),
            },
        );
    }

    // Konfirmasi Pembayaran Tagihan ke Database (PUT /tagihan/{numericId}/pay)
    function handleConfirmPayment(invoice: Invoice): void {
        // Ambil numeric id dari string format 'INV-2026-003' -> 3
        const match = invoice.id.match(/(\d+)$/);
        const numericId = match ? parseInt(match[1], 10) : invoice.id;

        setSubmitting(true);
        router.put(
            `/tagihan/${numericId}/pay`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => setPayingInvoice(null),
                onFinish: () => setSubmitting(false),
            },
        );
    }

    const from = sorted.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
    const to = Math.min(safePage * PAGE_SIZE, sorted.length);

    return (
        <AuthenticatedLayout>
            <Head title="Tagihan" />

            <PageHeader
                title="Tagihan"
                description="Kelola tagihan dan pembayaran pelanggan."
                actions={
                    isAdministrator ? (
                        <Button size="sm" onClick={() => setFormOpen(true)}>
                            <Plus className="h-4 w-4" />
                            Tambah Tagihan
                        </Button>
                    ) : undefined
                }
            />

            {/* Summary Cards dari Database */}
            <div className="mt-6">
                <InvoiceSummaryCards
                    total={summary.total}
                    unpaid={summary.unpaid}
                    paid={summary.paid}
                    unpaidAmount={summary.unpaidAmount}
                />
            </div>

            {/* Main Content Card */}
            <Card className="mt-6">
                <div className="mb-4">
                    <InvoiceFilters
                        search={search}
                        onSearchChange={(v) => {
                            setSearch(v);
                            setPage(1);
                        }}
                        statusFilter={statusFilter}
                        onStatusFilterChange={(v) => {
                            setStatusFilter(v);
                            setPage(1);
                        }}
                        periodFilter={periodFilter}
                        onPeriodFilterChange={(v) => {
                            setPeriodFilter(v);
                            setPage(1);
                        }}
                        periodOptions={periodOptions}
                    />
                </div>

                <InvoiceTable
                    invoices={paginated}
                    loading={false}
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onSortChange={handleSortChange}
                    onPay={(inv) => setPayingInvoice(inv)}
                    onView={(inv) => setDetailInvoice(inv)}
                    canPay={isAdministrator}
                    emptyMessage="Tidak ada tagihan yang cocok dengan filter"
                />

                <Pagination
                    currentPage={safePage}
                    lastPage={totalPages}
                    onPageChange={setPage}
                    total={sorted.length}
                    from={from}
                    to={to}
                />
            </Card>

            {/* Modal Tambah Tagihan */}
            {isAdministrator && (
                <InvoiceForm
                    open={formOpen}
                    customers={customers}
                    loading={submitting}
                    onSubmit={handleCreateInvoice}
                    onCancel={() => setFormOpen(false)}
                />
            )}

            {/* Dialog Konfirmasi Pembayaran */}
            {isAdministrator && (
                <InvoicePaymentDialog
                    invoice={payingInvoice}
                    open={payingInvoice !== null}
                    loading={submitting}
                    onConfirm={handleConfirmPayment}
                    onClose={() => setPayingInvoice(null)}
                />
            )}

            {/* Dialog Detail Tagihan */}
            <InvoiceDetailDialog
                invoice={detailInvoice}
                open={detailInvoice !== null}
                onClose={() => setDetailInvoice(null)}
                onPay={
                    isAdministrator ? (inv) => setPayingInvoice(inv) : undefined
                }
            />
        </AuthenticatedLayout>
    );
}
