import { Button, Input } from '@/components/ui';
import { useForm } from '@inertiajs/react';
import { KeyRound, ShieldCheck } from 'lucide-react';
import type { FormEvent } from 'react';

/**
 * Form ubah password akun terautentikasi dengan validasi backend & pesan Indonesia.
 */
export default function PasswordForm() {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    function handleSubmit(e: FormEvent): void {
        e.preventDefault();
        post('/profil/password', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <KeyRound className="h-4 w-4" />
                </span>
                <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                        Ubah Password
                    </h3>
                    <p className="text-xs text-slate-500">
                        Pastikan menggunakan kombinasi password yang kuat dan
                        unik.
                    </p>
                </div>
            </div>

            <Input
                label="Password Saat Ini"
                type="password"
                value={data.current_password}
                onChange={(e) => setData('current_password', e.target.value)}
                error={errors.current_password}
                placeholder="Masukkan password saat ini"
                autoComplete="current-password"
            />

            <Input
                label="Password Baru"
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                error={errors.password}
                placeholder="Minimal 8 karakter"
                autoComplete="new-password"
            />

            <Input
                label="Konfirmasi Password Baru"
                type="password"
                value={data.password_confirmation}
                onChange={(e) =>
                    setData('password_confirmation', e.target.value)
                }
                error={errors.password_confirmation}
                placeholder="Ulangi password baru"
                autoComplete="new-password"
            />

            <div className="flex items-center justify-between pt-2">
                {recentlySuccessful ? (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                        <ShieldCheck className="h-4 w-4" />
                        Password berhasil diperbarui!
                    </span>
                ) : (
                    <span className="text-[11px] text-slate-400">
                        Perubahan langsung berlaku pada sesi berikutnya.
                    </span>
                )}

                <Button type="submit" loading={processing} size="sm">
                    Simpan Password
                </Button>
            </div>
        </form>
    );
}
