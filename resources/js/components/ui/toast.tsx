import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type ToastProps = {
    type: 'success' | 'error';
    message: string;
    durationMs?: number; // auto hide after
    onClose?: () => void;
};

/**
 * Simple toast notification.
 * Appears fixed top‑right, fades in/out with Tailwind transitions.
 * Use by mounting <Toast ... /> when needed.
 */
export default function Toast({ type, message, durationMs = 3000, onClose }: ToastProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            if (onClose) onClose();
        }, durationMs);
        return () => clearTimeout(timer);
    }, [durationMs, onClose]);

    const bg = type === 'success' ? 'bg-emerald-500' : 'bg-rose-500';
    const iconColor = type === 'success' ? 'text-emerald-100' : 'text-rose-100';

    return (
        <div
            className={cn(
                'fixed top-4 right-4 z-50 w-80 rounded-lg p-4 text-white shadow-lg transition-all duration-300',
                visible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
                bg,
            )}
        >
            <div className="flex items-start justify-between">
                <div className="flex flex-1 items-start gap-3">
                    <div
                        className={cn(
                            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                            type === 'success' ? 'bg-white/20' : 'bg-white/20',
                        )}
                    >
                        {type === 'success' ? (
                            <Check className={cn('h-4 w-4 animate-in', iconColor)} strokeWidth={3} />
                        ) : (
                            <X className={cn('h-4 w-4 animate-in', iconColor)} strokeWidth={3} />
                        )}
                    </div>
                    <p className="text-sm font-medium">{message}</p>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        setVisible(false);
                        if (onClose) onClose();
                    }}
                    className={cn('ml-2 inline-flex items-center justify-center rounded-full p-1', iconColor)}
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
