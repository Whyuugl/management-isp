import { Button, Modal } from '@/components/ui';
import InvoiceStatusBadge from '@/components/invoice/status-badge';
import type { Invoice } from '@/types/invoice';
import {
    formatBillingPeriod,
    formatDateTime,
    formatRupiah,
} from '@/lib/format';

type InvoiceDetailDialogProps = {
    invoice: Invoice | null;
    open: boolean;
    onClose: () => void;
    onPay?: (invoice: Invoice) => void;
};

/**
 * Modal rincian tagihan (read-only) dengan opsi aksi bayar jika belum lunas.
 */
export default function InvoiceDetailDialog({
    invoice,
    open,
    onClose,
    onPay,
}: InvoiceDetailDialogProps) {
    if (!invoice) return null;

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Detail Tagihan"
            maxWidth="md"
        >
            <div className="space-y-4">
                <dl className="divide-y divide-slate-100">
                    <DetailRow label="Nomor Invoice" value={invoice.id} mono />
                    <DetailRow
                        label="Nama Pelanggan"
                        value={invoice.customer_name}
                    />
                    <DetailRow
                        label="Periode Tagihan"
                        value={formatBillingPeriod(invoice.billing_period)}
                    />
                    <DetailRow
                        label="Nominal Tagihan"
                        value={formatRupiah(invoice.amount)}
                        highlight
                    />
                    <div className="flex items-center justify-between py-2.5">
                        <dt className="text-sm text-slate-500">
                            Status Pembayaran
                        </dt>
                        <dd>
                            <InvoiceStatusBadge
                                status={invoice.payment_status}
                            />
                        </dd>
                    </div>
                    <DetailRow
                        label="Tanggal Pembayaran"
                        value={formatDateTime(invoice.paid_at)}
                    />
                    <DetailRow
                        label="Dibuat Pada"
                        value={formatDateTime(invoice.created_at)}
                    />
                </dl>

                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="secondary" onClick={onClose}>
                        Tutup
                    </Button>
                    {invoice.payment_status === 'unpaid' && onPay && (
                        <Button
                            variant="primary"
                            onClick={() => {
                                onClose();
                                onPay(invoice);
                            }}
                        >
                            Bayar Sekarang
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
}

function DetailRow({
    label,
    value,
    mono = false,
    highlight = false,
}: {
    label: string;
    value: string;
    mono?: boolean;
    highlight?: boolean;
}) {
    return (
        <div className="flex items-start justify-between gap-4 py-2.5">
            <dt className="text-sm text-slate-500">{label}</dt>
            <dd
                className={`text-right text-sm font-medium ${
                    mono ? 'font-mono' : ''
                } ${highlight ? 'text-blue-600' : 'text-slate-900'}`}
            >
                {value}
            </dd>
        </div>
    );
}
