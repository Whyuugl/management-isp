import PasswordForm from '@/components/account/password-form';
import { PageHeader } from '@/components/common';
import { Badge, Card } from '@/components/ui';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';
import { Calendar, Mail, Shield, User as UserIcon } from 'lucide-react';

type ProfileUser = {
    id: number;
    name: string;
    email: string;
    roleLabel: string;
    isAdministrator: boolean;
    createdAt: string;
};

type ProfilPageProps = {
    user: ProfileUser;
};

/**
 * Halaman Profil Pengguna: rincian akun + form ganti password mandiri.
 */
export default function Profil({ user }: ProfilPageProps) {
    return (
        <AuthenticatedLayout>
            <Head title="Profil Pengguna" />

            <PageHeader
                title="Profil Pengguna"
                description="Informasi akun dan pengaturan keamanan kredensial Anda."
            />

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Kartu Profil / Identitas */}
                <Card className="lg:col-span-1">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 text-2xl font-bold text-white shadow-lg shadow-blue-500/20">
                            {initials(user.name)}
                        </div>
                        <h2 className="mt-4 text-base font-bold text-slate-900">
                            {user.name}
                        </h2>
                        <p className="text-xs text-slate-500">{user.email}</p>

                        <div className="mt-3">
                            <Badge
                                variant={
                                    user.isAdministrator ? 'info' : 'default'
                                }
                            >
                                {user.roleLabel}
                            </Badge>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3 border-t border-slate-100 pt-4 text-xs">
                        <div className="flex items-center justify-between text-slate-600">
                            <span className="flex items-center gap-2 text-slate-400">
                                <UserIcon className="h-4 w-4" />
                                User ID
                            </span>
                            <span className="font-mono font-medium text-slate-900">
                                #{user.id}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                            <span className="flex items-center gap-2 text-slate-400">
                                <Mail className="h-4 w-4" />
                                Email
                            </span>
                            <span className="font-medium text-slate-900">
                                {user.email}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                            <span className="flex items-center gap-2 text-slate-400">
                                <Shield className="h-4 w-4" />
                                Hak Akses
                            </span>
                            <span className="font-medium text-slate-900">
                                {user.roleLabel}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                            <span className="flex items-center gap-2 text-slate-400">
                                <Calendar className="h-4 w-4" />
                                Terdaftar
                            </span>
                            <span className="font-medium text-slate-900">
                                {user.createdAt}
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Form Ganti Password */}
                <Card className="lg:col-span-2">
                    <PasswordForm />
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}

function initials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();
}
