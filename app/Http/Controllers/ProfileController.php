<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller: profil pengguna & pengaturan akun.
 * Menampilkan data akun, ubah password, serta halaman pengaturan.
 */
class ProfileController extends Controller
{
    /**
     * Halaman Profil: data akun + form ubah password.
     */
    public function edit(Request $request): Response
    {
        /** @var User|null $user */
        $user = $request->user();

        return Inertia::render('profil', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roleLabel' => $user->role->label(),
                'isAdministrator' => $user->isAdministrator(),
                'createdAt' => $user->created_at?->format('d M Y, H:i') ?? '-',
            ],
        ]);
    }

    /**
     * Halaman Pengaturan: ringkasan akun, keamanan, tautan cepat.
     */
    public function settings(Request $request): Response
    {
        /** @var User|null $user */
        $user = $request->user();

        return Inertia::render('pengaturan', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roleLabel' => $user->role->label(),
                'isAdministrator' => $user->isAdministrator(),
                'createdAt' => $user->created_at?->format('d M Y, H:i') ?? '-',
            ],
        ]);
    }

    /**
     * Proses ubah password akun dari halaman profil/pengaturan.
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'string', 'current_password'],
            'password' => ['required', 'string', Password::defaults(), 'confirmed'],
        ], [
            'current_password.required' => 'Password saat ini wajib diisi.',
            'current_password.current_password' => 'Password saat ini tidak sesuai.',
            'password.required' => 'Password baru wajib diisi.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
        ]);

        /** @var User $user */
        $user = $request->user();
        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Password berhasil diperbarui.');
    }
}
