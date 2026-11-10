import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import { AlertTriangle } from 'lucide-react';

type ConfirmDialogProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
    confirmLabel?: string;
    loading?: boolean;
};

export default function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title = 'Konfirmasi',
    message,
    confirmLabel = 'Ya, Lanjutkan',
    loading = false,
}: ConfirmDialogProps) {
    return (
        <Modal open={open} onClose={onClose} maxWidth="sm">
            <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                    <h3 className="text-base font-semibold text-slate-900">
                        {title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">{message}</p>
                </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
                <Button variant="secondary" onClick={onClose}>
                    Batal
                </Button>
                <Button variant="danger" onClick={onConfirm} loading={loading}>
                    {confirmLabel}
                </Button>
            </div>
        </Modal>
    );
}
