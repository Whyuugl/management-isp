import { Badge } from '@/components/ui';
import type { InvoicePaymentStatus } from '@/types/invoice';

/**
 * Badge status pembayaran tagihan.
 * Lunas: hijau, Belum Bayar: kuning.
 */
export default function InvoiceStatusBadge({
    status,
}: {
    status: InvoicePaymentStatus;
}) {
    const isPaid = status === 'paid';

    return (
        <Badge variant={isPaid ? 'success' : 'warning'}>
            {isPaid ? 'Lunas' : 'Belum Bayar'}
        </Badge>
    );
}
