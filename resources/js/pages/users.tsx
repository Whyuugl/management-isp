import { PageHeader, SearchInput } from '@/components/common';
import ConfirmDialog from '@/components/common/confirm-dialog';
import { DataTable, type Column } from '@/components/table';
import { Badge, Button, Card, Input, Modal, Select } from '@/components/ui';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Shield, Trash2, User as UserIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

/** Baris user yang dikirim dari UserController@index. */
type ManagedUser = {
    id: number;
    name: string;
    email: string;
    role: 'administrator' | 'staff';
    roleLabel: string;
    createdAt: string;
};

type UsersPageProps = {
    users: ManagedUser[];
};

type UserForm = {
    name: string;
    email: string;
    password: string;
    role: 'administrator' | 'staff';
};

const emptyForm: UserForm = {
    name: '',
    email: '',
    password: '',
    role: 'staff',
};

/**
 * Halaman Modul Manajemen User (khusus Administrator).
 * Fitur: daftar user, tambah, edit, hapus.
 */
export default function UserManagement({ users }: UsersPageProps) {
    const [search, setSearch] = useState('');
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<ManagedUser | null>(null);
    const [deleting, setDeleting] = useState<ManagedUser | null>(null);

    const form = useForm<UserForm>(emptyForm);

    const filteredUsers = useMemo(() => {
        const q = search.toLowerCase();

        return users.filter(
            (user) =>
                user.name.toLowerCase().includes(q) ||
                user.email.toLowerCase().includes(q) ||
                user.roleLabel.toLowerCase().includes(q),
        );
    }, [users, search]);

    /** Buka modal tambah user. */
    function openCreate(): void {
        setEditing(null);
        form.reset();
        form.clearErrors();
        setFormOpen(true);
    }

    /** Buka modal edit user dan isi form dengan data terpilih. */
    function openEdit(user: ManagedUser): void {
        setEditing(user);
        form.setData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
        });
        form.clearErrors();
        setFormOpen(true);
    }

    /** Simpan user baru atau kirim perubahan data user. */
    function submit(event: React.FormEvent): void {
        event.preventDefault();

        if (editing) {
            form.put(`/users/${editing.id}`, {
                preserveScroll: true,
                onSuccess: () => setFormOpen(false),
            });

            return;
        }

        form.post('/users', {
            preserveScroll: true,
            onSuccess: () => setFormOpen(false),
        });
    }

    /** Hapus user setelah konfirmasi. */
    function confirmDelete(): void {
        if (!deleting) {
            return;
        }

        router.delete(`/users/${deleting.id}`, {
            preserveScroll: true,
            onFinish: () => setDeleting(null),
        });
    }

    const columns: Column<ManagedUser>[] = [
        {
            key: 'name',
            header: 'Pengguna',
            render: (user) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700">
                        {user.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-medium text-slate-900">
                            {user.name}
                        </p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'role',
            header: 'Role',
            render: (user) => (
                <Badge
                    variant={user.role === 'administrator' ? 'info' : 'default'}
                >
                    <span className="flex items-center gap-1">
                        {user.role === 'administrator' ? (
                            <Shield className="h-3 w-3" />
                        ) : (
                            <UserIcon className="h-3 w-3" />
                        )}
                        {user.roleLabel}
                    </span>
                </Badge>
            ),
        },
        {
            key: 'createdAt',
            header: 'Tanggal Dibuat',
            render: (user) => (
                <span className="text-xs text-slate-500">{user.createdAt}</span>
            ),
        },
        {
            key: 'actions',
            header: 'Aksi',
            render: (user) => (
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(user)}
                    >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => setDeleting(user)}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        Hapus
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen User" />
            <PageHeader
                title="Manajemen User"
                description="Kelola akun pengguna dan hak akses aplikasi"
                actions={
                    <Button size="sm" onClick={openCreate}>
                        <Plus className="h-4 w-4" />
                        Tambah User
                    </Button>
                }
            />

            <Card className="mt-6">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <SearchInput
                        placeholder="Cari user (nama, email, role)..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        containerClassName="w-full sm:max-w-sm"
                    />
                    <p className="text-sm text-slate-500">
                        Total {filteredUsers.length} pengguna
                    </p>
                </div>

                <DataTable
                    columns={columns}
                    data={filteredUsers}
                    keyExtractor={(user) => user.id}
                    emptyMessage="Tidak ada user ditemukan"
                />
            </Card>

            {/* Modal Tambah / Edit User */}
            <Modal
                open={formOpen}
                onClose={() => setFormOpen(false)}
                title={editing ? 'Edit User' : 'Tambah User'}
            >
                <form onSubmit={submit} className="space-y-4">
                    <Input
                        label="Nama"
                        value={form.data.name}
                        onChange={(e) => form.setData('name', e.target.value)}
                        error={form.errors.name}
                        required
                    />
                    <Input
                        label="Email"
                        type="email"
                        value={form.data.email}
                        onChange={(e) => form.setData('email', e.target.value)}
                        error={form.errors.email}
                        required
                    />
                    <Input
                        label={
                            editing
                                ? 'Password (kosongkan jika tidak diubah)'
                                : 'Password'
                        }
                        type="password"
                        value={form.data.password}
                        onChange={(e) =>
                            form.setData('password', e.target.value)
                        }
                        error={form.errors.password}
                        required={!editing}
                    />
                    <Select
                        label="Role"
                        value={form.data.role}
                        onChange={(e) =>
                            form.setData(
                                'role',
                                e.target.value as UserForm['role'],
                            )
                        }
                        error={form.errors.role}
                        options={[
                            { value: 'administrator', label: 'Administrator' },
                            { value: 'staff', label: 'Staff' },
                        ]}
                    />

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setFormOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button type="submit" loading={form.processing}>
                            {editing ? 'Simpan Perubahan' : 'Tambah User'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Konfirmasi Hapus */}
            <ConfirmDialog
                open={deleting !== null}
                onClose={() => setDeleting(null)}
                onConfirm={confirmDelete}
                title="Hapus User"
                message={`Yakin ingin menghapus ${deleting?.name ?? 'user ini'}? Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel="Ya, Hapus"
            />
        </AuthenticatedLayout>
    );
}
