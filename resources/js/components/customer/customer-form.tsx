import { useEffect, useState } from 'react';
import { Button, Input, Modal, Select } from '@/components/ui';
import type { Customer, CustomerStatus } from '@/types/customer';

export type CustomerFormValues = {
    name: string;
    phone: string;
    address: string;
    package: string;
    price: string;
    status: CustomerStatus;
};

export const emptyCustomerForm: CustomerFormValues = {
    name: '',
    phone: '',
    address: '',
    package: '',
    price: '',
    status: 'active',
};

type CustomerFormProps = {
    open: boolean;
    initial?: Customer | null;
    onSubmit: (values: CustomerFormValues) => void;
    onCancel: () => void;
    loading?: boolean;
};

type Errors = Partial<Record<keyof CustomerFormValues, string>>;

/**
 * Form tambah / edit pelanggan.
 * Validasi client‑side langsung (required, telepon, harga).
 */
export default function CustomerForm({
    open,
    initial,
    onSubmit,
    onCancel,
    loading = false,
}: CustomerFormProps) {
    const [values, setValues] = useState<CustomerFormValues>(() =>
        initial
            ? {
                  name: initial.name,
                  phone: initial.phone,
                  address: initial.address,
                  package: initial.package,
                  price: initial.price.toString(),
                  status: initial.status,
              }
            : emptyCustomerForm,
    );
    const [errors, setErrors] = useState<Errors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const isEdit = Boolean(initial);

    // Reset form saat modal dibuka dengan data berbeda
    useEffect(() => {
        if (!open) {
            return;
        }

        setValues(
            initial
                ? {
                      name: initial.name,
                      phone: initial.phone,
                      address: initial.address,
                      package: initial.package,
                      price: initial.price.toString(),
                      status: initial.status,
                  }
                : emptyCustomerForm,
        );
        setErrors({});
        setTouched({});
    }, [open, initial]);

    function validate(next: CustomerFormValues): Errors {
        const nextErrors: Errors = {};
        if (!next.name.trim()) {
            nextErrors.name = 'Nama pelanggan wajib diisi.';
        }
        if (!next.phone.trim()) {
            nextErrors.phone = 'Nomor telepon wajib diisi.';
        } else if (!/^[0-9+\-\s()]{6,20}$/.test(next.phone)) {
            nextErrors.phone = 'Format nomor telepon tidak valid.';
        }
        if (!next.address.trim()) {
            nextErrors.address = 'Alamat wajib diisi.';
        }
        if (!next.package.trim()) {
            nextErrors.package = 'Paket internet wajib diisi.';
        }
        if (!next.price.trim()) {
            nextErrors.price = 'Harga paket wajib diisi.';
        } else if (
            Number.isNaN(Number(next.price)) ||
            Number(next.price) <= 0
        ) {
            nextErrors.price = 'Harga paket harus berupa angka lebih dari 0.';
        }
        return nextErrors;
    }

    function updateField<K extends keyof CustomerFormValues>(
        key: K,
        value: CustomerFormValues[K],
    ): void {
        const next = { ...values, [key]: value };
        setValues(next);
        if (touched[key]) {
            setErrors(validate(next));
        }
    }

    function markTouched(key: keyof CustomerFormValues): void {
        setTouched((prev) => ({ ...prev, [key]: true }));
        setErrors(validate(values));
    }

    function handleSubmit(event: React.FormEvent): void {
        event.preventDefault();
        const validation = validate(values);
        setErrors(validation);
        if (Object.keys(validation).length > 0) {
            setTouched({
                name: true,
                phone: true,
                address: true,
                package: true,
                price: true,
            });
            return;
        }
        onSubmit(values);
    }

    return (
        <Modal
            open={open}
            onClose={onCancel}
            title={isEdit ? 'Edit Pelanggan' : 'Tambah Pelanggan'}
            maxWidth="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-slate-700">
                        Nama Pelanggan <span className="text-red-500">*</span>
                    </label>
                    <Input
                        value={values.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        onBlur={() => markTouched('name')}
                        placeholder="Contoh: Budi Santoso"
                        error={touched.name ? errors.name : undefined}
                        required
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="text-sm font-medium text-slate-700">
                            Nomor Telepon{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={values.phone}
                            onChange={(e) =>
                                updateField('phone', e.target.value)
                            }
                            onBlur={() => markTouched('phone')}
                            placeholder="0812xxxx"
                            error={touched.phone ? errors.phone : undefined}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700">
                            Paket Internet{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={values.package}
                            onChange={(e) =>
                                updateField('package', e.target.value)
                            }
                            onBlur={() => markTouched('package')}
                            placeholder="Contoh: Home 30 Mbps"
                            error={touched.package ? errors.package : undefined}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700">
                        Alamat <span className="text-red-500">*</span>
                    </label>
                    <Input
                        value={values.address}
                        onChange={(e) => updateField('address', e.target.value)}
                        onBlur={() => markTouched('address')}
                        placeholder="Jl. ..."
                        error={touched.address ? errors.address : undefined}
                        required
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="text-sm font-medium text-slate-700">
                            Harga Paket <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="number"
                            min="0"
                            value={values.price}
                            onChange={(e) =>
                                updateField('price', e.target.value)
                            }
                            onBlur={() => markTouched('price')}
                            placeholder="300000"
                            error={touched.price ? errors.price : undefined}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700">
                            Status Pelanggan{' '}
                            <span className="text-red-500">*</span>
                        </label>
                        <Select
                            value={values.status}
                            onChange={(e) =>
                                updateField(
                                    'status',
                                    e.target.value as CustomerStatus,
                                )
                            }
                            options={[
                                { value: 'active', label: 'Aktif' },
                                { value: 'suspend', label: 'Suspend' },
                                { value: 'disconnected', label: 'Putus' },
                            ]}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Batal
                    </Button>
                    <Button type="submit" loading={loading}>
                        {isEdit ? 'Simpan Perubahan' : 'Simpan Pelanggan'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
