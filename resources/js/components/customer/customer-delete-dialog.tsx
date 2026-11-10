import ConfirmDialog from '@/components/common/confirm-dialog';
import type { Customer } from '@/types/customer';

type CustomerDeleteDialogProps = {
    customer: Customer | null;
    loading?: boolean;
    onConfirm: () => void;
    onClose: () => void;
};

/**
 * Dialog konfirmasi hapus pelanggan.
 * Tindakan destruktif: tombol konfirmasi berwarna merah.
 */
export default function CustomerDeleteDialog({
    customer,
    loading = false,
    onConfirm,
    onClose,
}: CustomerDeleteDialogProps) {
    return (
        <ConfirmDialog
            open={customer !== null}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Hapus Pelanggan"
            message={`Yakin ingin menghapus ${
                customer?.name ?? 'pelanggan ini'
            }? Tindakan ini tidak dapat dibatalkan.`}
            confirmLabel="Ya, Hapus"
            loading={loading}
        />
    );
}
