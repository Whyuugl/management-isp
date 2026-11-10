import Sidebar from '@/components/layout/sidebar';
import Topbar from '@/components/layout/topbar';
import Toast from '@/components/ui/toast';
import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

type AuthenticatedLayoutProps = {
    children: ReactNode;
};

/**
 * Layout utama untuk halaman yang butuh login.
 * Menampilkan toast global untuk pesan flash (sukses / gagal).
 */
export default function AuthenticatedLayout({
    children,
}: AuthenticatedLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { flash } = usePage<{
        flash?: { success?: string; error?: string };
    }>().props;

    const [toast, setToast] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
        }
    }, [flash?.success, flash?.error]);

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Main content area offset by sidebar width on desktop */}
            <div className="lg:pl-64">
                <Topbar onMenuClick={() => setSidebarOpen(true)} />
                <main className="p-4 lg:p-6">{children}</main>
            </div>
        </div>
    );
}
