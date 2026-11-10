import { Button, Input, Modal, Select } from '@/components/ui';
import type { Customer } from '@/types/customer';
import { useEffect, useState } from 'react';

export type InvoiceFormValues = {
    customer_id: string; // string for select input binding
    billing_period: string; // YYYY-MM
    amount: string; // string for number input binding
};

export const emptyInvoiceForm: InvoiceFormValues = {
    customer_id: '',
    billing_period: getDefaultPeriod(),
    amount: '',
};

function getDefaultPeriod(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
}

type InvoiceFormProps = {
    open: boolean;
    customers: Customer[];
    onSubmit: (values: InvoiceFormValues) => void;
    onCancel: () => void;
    loading?: boolean;
};

type Errors = Partial<Record<keyof InvoiceFormValues, string>>;

/**
 * Form tambah tagihan baru.
 * Fields: Pelanggan (select), Periode Tagihan (month), Nominal Tagihan (Rupiah).
 * Validasi client-side bahasa Indonesia, nominal > 0.
 * Otomatis mengisi nominal default berdasarkan harga paket pelanggan saat pelanggan dipilih.
 */
export default function InvoiceForm({
    open,
    customers,
    onSubmit,
    onCancel,
    loading = false,
}: InvoiceFormProps) {
    const [values, setValues] = useState<InvoiceFormValues>(emptyInvoiceForm);
    const [errors, setErrors] = useState<Errors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (!open) return;
        setValues(emptyInvoiceForm);
        setErrors({});
        setTouched({});
    }, [open]);

    function validate(next: InvoiceFormValues): Errors {
        const nextErrors: Errors = {};

        if (!next.customer_id) {
            nextErrors.customer_id = 'Pelanggan wajib dipilih.';
        }

        if (!next.billing_period.trim()) {
            nextErrors.billing_period = 'Periode tagihan wajib diisi.';
        } else if (!/^\d{4}-\d{2}$/.test(next.billing_period)) {
            nextErrors.billing_period = 'Format periode harus YYYY-MM.';
        }

        if (!next.amount.trim()) {
            nextErrors.amount = 'Nominal tagihan wajib diisi.';
        } else {
            const num = Number(next.amount);
            if (Number.isNaN(num) || num <= 0) {
                nextErrors.amount = 'Nominal tagihan harus lebih besar dari 0.';
            }
        }

        return nextErrors;
    }

    function handleCustomerChange(customerId: string): void {
        const selected = customers.find((c) => String(c.id) === customerId);
        const next: InvoiceFormValues = {
            ...values,
            customer_id: customerId,
            // Otomatis isi default amount sesuai harga paket jika belum diisi manual
            amount: selected ? String(selected.price) : values.amount,
        };
        setValues(next);
        if (touched.customer_id) {
            setErrors(validate(next));
        }
    }

    function updateField<K extends keyof InvoiceFormValues>(
        key: K,
        val: InvoiceFormValues[K],
    ): void {
        const next = { ...values, [key]: val };
        setValues(next);
        if (touched[key]) {
            setErrors(validate(next));
        }
    }

    function markTouched(key: keyof InvoiceFormValues): void {
        setTouched((prev) => ({ ...prev, [key]: true }));
        setErrors(validate(values));
    }

    function handleSubmit(event: React.FormEvent): void {
        event.preventDefault();
        const validation = validate(values);
        setErrors(validation);

        if (Object.keys(validation).length > 0) {
            setTouched({
                customer_id: true,
                billing_period: true,
                amount: true,
            });
            return;
        }

        onSubmit(values);
    }

    const customerOptions = customers.map((c) => ({
        value: String(c.id),
        label: `${c.name} — ${c.package}`,
    }));

    return (
        <Modal
            open={open}
            onClose={onCancel}
            title="Tambah Tagihan Baru"
            maxWidth="md"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-slate-700">
                        Pelanggan <span className="text-red-500">*</span>
                    </label>
                    <Select
                        value={values.customer_id}
                        onChange={(e) => handleCustomerChange(e.target.value)}
                        onBlur={() => markTouched('customer_id')}
                        placeholder="Pilih Pelanggan"
                        options={customerOptions}
                        error={
                            touched.customer_id ? errors.customer_id : undefined
                        }
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700">
                        Periode Tagihan <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="month"
                        value={values.billing_period}
                        onChange={(e) =>
                            updateField('billing_period', e.target.value)
                        }
                        onBlur={() => markTouched('billing_period')}
                        error={
                            touched.billing_period
                                ? errors.billing_period
                                : undefined
                        }
                        required
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700">
                        Nominal Tagihan (Rp){' '}
                        <span className="text-red-500">*</span>
                    </label>
                    <Input
                        type="number"
                        min="1"
                        placeholder="300000"
                        value={values.amount}
                        onChange={(e) => updateField('amount', e.target.value)}
                        onBlur={() => markTouched('amount')}
                        error={touched.amount ? errors.amount : undefined}
                        required
                    />
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
                        Simpan Tagihan
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
