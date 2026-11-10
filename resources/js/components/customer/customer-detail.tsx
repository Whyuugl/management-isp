import { Button, Modal } from '@/components/ui';
import CustomerStatusBadge from '@/components/customer/status-badge';
import type { Customer } from '@/types/customer';

type CustomerDetailProps = {
    customer: Customer | null;
    onClose: () => void;
    onEdit: (customer: Customer) => void;
};

/**
 * Modal detail pelanggan (read-only).
 */
export default function CustomerDetail({
    customer,
    onClose,
    onEdit,
}: CustomerDetailProps) {
    return (
        <Modal
            open={customer !== null}
            onClose={onClose}
            title="Detail Pelanggan"
        >
            {customer && (
                <div className="space-y-4">
                    <dl className="divide-y divide-slate-100">
                        <DetailRow label="Nama" value={customer.name} />
                        <DetailRow
                            label="Nomor Telepon"
                            value={customer.phone}
                        />
                        <DetailRow label="Alamat" value={customer.address} />
                        <DetailRow
                            label="Paket Internet"
                            value={customer.package}
                        />
                        <DetailRow
                            label="Harga Paket"
                            value={`Rp ${customer.price.toLocaleString('id-ID')}`}
                        />
                        <div className="flex items-center justify-between py-2.5">
                            <dt className="text-sm text-slate-500">Status</dt>
                            <dd>
                                <CustomerStatusBadge status={customer.status} />
                            </dd>
                        </div>
                    </dl>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="secondary" onClick={onClose}>
                            Tutup
                        </Button>
                        <Button onClick={() => onEdit(customer)}>Edit</Button>
                    </div>
                </div>
            )}
        </Modal>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between gap-4 py-2.5">
            <dt className="text-sm text-slate-500">{label}</dt>
            <dd className="text-right text-sm font-medium text-slate-900">
                {value}
            </dd>
        </div>
    );
}
