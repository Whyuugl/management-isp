import { PageHeader } from '@/components/common';
import CustomerDeleteDialog from '@/components/customer/customer-delete-dialog';
import CustomerDetail from '@/components/customer/customer-detail';
import CustomerFilters from '@/components/customer/filters';
import CustomerForm, {
    type CustomerFormValues,
} from '@/components/customer/customer-form';
import CustomerSummaryCards from '@/components/customer/summary-cards';
import CustomerTable, {
    type SortDirection,
    type SortKey,
} from '@/components/customer/customer-table';
import Pagination from '@/components/table/pagination';
import { Button, Card } from '@/components/ui';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import type { Auth } from '@/types/auth';
import type { Customer } from '@/types/customer';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

const PAGE_SIZE = 5;

type CustomerSummary = {
    total: number;
    active: number;
    suspend: number;
    disconnected: number;
};

type PelangganPageProps = {
    customers: Customer[];
    summary: CustomerSummary;
};

/**
 * Halaman Manajemen Pelanggan — data dan operasi langsung ke database MySQL.
 */
export default function Pelanggan({ customers, summary }: PelangganPageProps) {
    const { auth } = usePage<{ auth?: Auth }>().props;
    const isAdministrator = auth?.user?.role === 'administrator';

    // Filter & Sort di client atas dataset database
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('name');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [page, setPage] = useState(1);

    // Modal state
    const [formOpen, setFormOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(
        null,
    );
    const [detailCustomer, setDetailCustomer] = useState<Customer | null>(null);
    const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(
        null,
    );
    const [submitting, setSubmitting] = useState(false);

    // Filtering
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();

        return customers.filter((customer) => {
            const matchesSearch =
                q === '' ||
                customer.name.toLowerCase().includes(q) ||
                customer.phone.toLowerCase().includes(q);

            const matchesStatus =
                statusFilter === '' || customer.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [customers, search, statusFilter]);

    // Sorting
    const sorted = useMemo(() => {
        const list = [...filtered];

        list.sort((a, b) => {
            let res = 0;
            switch (sortKey) {
                case 'name':
                    res = a.name.localeCompare(b.name, 'id');
                    break;
                case 'phone':
                    res = a.phone.localeCompare(b.phone);
                    break;
                case 'package':
                    res = a.package.localeCompare(b.package, 'id');
                    break;
                case 'price':
                    res = a.price - b.price;
                    break;
                case 'status':
                    res = a.status.localeCompare(b.status);
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

    function handleSortChange(key: SortKey): void {
        if (sortKey === key) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    }

    function handleOpenCreate(): void {
        setEditingCustomer(null);
        setFormOpen(true);
    }

    function handleOpenEdit(customer: Customer): void {
        setDetailCustomer(null);
        setEditingCustomer(customer);
        setFormOpen(true);
    }

    // Simpan ke database via POST /pelanggan atau PUT /pelanggan/{id}
    function handleSave(values: CustomerFormValues): void {
        setSubmitting(true);

        const payload = {
            name: values.name.trim(),
            phone: values.phone.trim(),
            address: values.address.trim(),
            internet_package: values.package.trim(),
            package_price: Number(values.price) || 0,
            status: values.status,
        };

        if (editingCustomer) {
            router.put(`/pelanggan/${editingCustomer.id}`, payload, {
                preserveScroll: true,
                onSuccess: () => {
                    setFormOpen(false);
                    setEditingCustomer(null);
                },
                onFinish: () => setSubmitting(false),
            });
            return;
        }

        router.post('/pelanggan', payload, {
            preserveScroll: true,
            onSuccess: () => setFormOpen(false),
            onFinish: () => setSubmitting(false),
        });
    }

    // Hapus dari database (soft delete) via DELETE /pelanggan/{id}
    function handleDeleteConfirm(): void {
        if (!deletingCustomer) return;

        setSubmitting(true);
        router.delete(`/pelanggan/${deletingCustomer.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setSubmitting(false);
                setDeletingCustomer(null);
            },
        });
    }

    const from = sorted.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
    const to = Math.min(safePage * PAGE_SIZE, sorted.length);

    return (
        <AuthenticatedLayout>
            <Head title="Pelanggan" />

            <PageHeader
                title="Pelanggan"
                description="Kelola data pelanggan internet."
                actions={
                    <Button size="sm" onClick={handleOpenCreate}>
                        <Plus className="h-4 w-4" />
                        Tambah Pelanggan
                    </Button>
                }
            />

            {/* Summary Cards dari Database */}
            <div className="mt-6">
                <CustomerSummaryCards
                    total={summary.total}
                    active={summary.active}
                    suspend={summary.suspend}
                    disconnected={summary.disconnected}
                />
            </div>

            {/* Main Content Card */}
            <Card className="mt-6">
                <div className="mb-4">
                    <CustomerFilters
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
                    />
                </div>

                <CustomerTable
                    customers={paginated}
                    loading={false}
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onSortChange={handleSortChange}
                    onView={setDetailCustomer}
                    onEdit={handleOpenEdit}
                    onDelete={setDeletingCustomer}
                    canDelete={isAdministrator}
                    emptyMessage="Tidak ada pelanggan yang cocok dengan pencarian"
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

            {/* Form Modal (Tambah / Edit) */}
            <CustomerForm
                open={formOpen}
                initial={editingCustomer}
                onSubmit={handleSave}
                loading={submitting}
                onCancel={() => {
                    setFormOpen(false);
                    setEditingCustomer(null);
                }}
            />

            {/* Detail Modal */}
            <CustomerDetail
                customer={detailCustomer}
                onClose={() => setDetailCustomer(null)}
                onEdit={handleOpenEdit}
            />

            {/* Konfirmasi Hapus */}
            <CustomerDeleteDialog
                customer={deletingCustomer}
                loading={submitting}
                onConfirm={handleDeleteConfirm}
                onClose={() => setDeletingCustomer(null)}
            />
        </AuthenticatedLayout>
    );
}
