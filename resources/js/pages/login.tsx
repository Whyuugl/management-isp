import { usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Toast from '@/components/ui/toast';
import { Wifi } from 'lucide-react';

type LoginPageProps = {
    errors: {
        email?: string;
        password?: string;
    };
    flash: {
        success?: string;
        error?: string;
    };
};

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const { errors, flash } = usePage<LoginPageProps>().props;

    // Pop-up gagal / sukses
    const [toastType, setToastType] = useState<'success' | 'error'>('error');
    const [toastMessage, setToastMessage] = useState('');

    // Jika sesi flash berisi pesan sukses, tampilkan toast sukses
    useEffect(() => {
        if (flash.success) {
            setToastType('success');
            setToastMessage(flash.success);
        }
    }, [flash.success]);

    useEffect(() => {
        if (errors.email || errors.password) {
            setToastType('error');
            setToastMessage(
                errors.email
                    ? errors.email
                    : 'Email atau password yang Anda masukkan salah.',
            );
        }
    }, [errors.email, errors.password]);

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        router.post('/login', {
            email,
            password,
            remember,
        });
    }

    return (
        <>
            <Head title="Masuk" />
            {toastMessage !== '' && (
                <Toast
                    type={toastType === 'success' ? 'success' : 'error'}
                    message={toastMessage}
                    onClose={() => setToastMessage('')}
                />
            )}
            <div className="flex min-h-screen bg-slate-50">
                {/* Brand panel */}
                <aside className="hidden w-1/2 flex-col justify-between bg-slate-900 p-12 text-white lg:flex">
                    <div className="flex items-center gap-3">
                        <Wifi className="h-7 w-7 text-blue-400" />
                        <span className="text-xl font-semibold">
                            Management ISP
                        </span>
                    </div>

                    <div className="max-w-md">
                        <h1 className="text-3xl leading-tight font-semibold">
                            Kelola layanan internet dalam satu tempat.
                        </h1>
                        <p className="mt-4 text-sm leading-relaxed text-slate-400">
                            Pantau pelanggan, tagihan, dan performa bisnis ISP
                            Anda secara real-time.
                        </p>
                    </div>

                    <p className="text-xs text-slate-500">
                        © {new Date().getFullYear()} Management ISP
                    </p>
                </aside>

                {/* Form panel */}
                <main className="flex w-full items-center justify-center p-6 lg:w-1/2">
                    <div className="w-full max-w-sm">
                        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
                            <Wifi className="h-6 w-6 text-blue-600" />
                            <span className="text-lg font-semibold text-slate-900">
                                Management ISP
                            </span>
                        </div>

                        <h2 className="text-2xl font-semibold text-slate-900">
                            Masuk ke akun Anda
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Gunakan email dan password yang terdaftar.
                        </p>

                        <form
                            onSubmit={handleSubmit}
                            className="mt-8 space-y-5"
                        >
                            <Input
                                label="Email"
                                type="email"
                                placeholder="admin@isp.co.id"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                                error={errors.email}
                            />

                            <Input
                                label="Password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                                error={errors.password}
                            />

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm text-slate-600">
                                    <input
                                        type="checkbox"
                                        checked={remember}
                                        onChange={(e) =>
                                            setRemember(e.target.checked)
                                        }
                                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    Ingat saya
                                </label>
                                <button
                                    type="button"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                >
                                    Lupa password?
                                </button>
                            </div>

                            <Button type="submit" className="w-full">
                                Masuk
                            </Button>
                        </form>

                        <p className="mt-8 text-center text-xs text-slate-400">
                            Belum punya akun? Hubungi administrator.
                        </p>
                    </div>
                </main>
            </div>
        </>
    );
}
