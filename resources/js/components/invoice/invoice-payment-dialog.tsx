import { Button, Modal } from '@/components/ui';
import type { Invoice } from '@/types/invoice';
import { formatBillingPeriod, formatRupiah } from '@/lib/format';
import { CheckCircle2 } from 'lucide-react';

type InvoicePaymentDialogProps = {
    invoice: Invoice | null;
    open: boolean;
    loading?: boolean;
    onConfirm: (invoice: Invoice) => void;
    onClose: () => void;
};

/**
 * Dialog konfirmasi pembayaran tagihan.
 * Mengubah status dari unpaid -> paid dan mengisi paid_at waktu sekarang.
 */
export default function InvoicePaymentDialog({
    invoice,
    open,
    loading = false,
    onConfirm,
    onClose,
}: InvoicePaymentDialogProps) {
    if (!invoice) return null;

    return (
        <Modal
            open={open}
            onClose={onClose}
            maxWidth="sm"
            title="Konfirmasi Pembayaran"
        >
            <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-600">
                        Konfirmasi pembayaran untuk tagihan berikut:
                    </p>
                    <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs">
                        <div className="flex justify-between py-1">
                            <span className="text-slate-500">No. Invoice</span>
                            <span className="font-mono font-medium text-slate-900">
                                {invoice.id}
                            </span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="text-slate-500">Pelanggan</span>
                            <span className="font-medium text-slate-900">
                                {invoice.customer_name}
                            </span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="text-slate-500">Periode</span>
                            <span className="text-slate-900">
                                {formatBillingPeriod(invoice.billing_period)}
                            </span>
                        </div>
                        <div className="flex justify-between border-t border-slate-200 pt-1.5 font-medium">
                            <span className="text-slate-700">
                                Total Nominal
                            </span>
                            <span className="text-emerald-600">
                                {formatRupiah(invoice.amount)}
                            </span>
                        </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">
                        Status akan diperbarui menjadi <strong>Lunas</strong>{' '}
                        dengan tanggal pembayaran saat ini.
                    </p>
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <Button
                    variant="secondary"
                    onClick={onClose}
                    disabled={loading}
                >
                    Batal
                </Button>
                <Button
                    variant="primary"
                    onClick={() => onConfirm(invoice)}
                    loading={loading}
                >
                    Konfirmasi Lunas
                </Button>
            </div>
        </Modal>
    );
}
