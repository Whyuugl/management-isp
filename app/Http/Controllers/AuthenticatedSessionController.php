<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller untuk mengelola sesi autentikasi (Login / Logout).
 * Menggunakan session guard bawaan Laravel.
 */
class AuthenticatedSessionController extends Controller
{
    /**
     * Tampilkan halaman login aplikasi.
     * Fitur: Tampilan awal saat pengguna belum masuk.
     */
    public function create(): Response
    {
        return Inertia::render('login');
    }

    /**
     * Proses login pengguna dengan email dan password.
     * Mengamankan sesi dari session fixation.
     */
    public function store(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ], [
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'password.required' => 'Password wajib diisi.',
        ]);

        $remember = $request->boolean('remember');

        if (! Auth::attempt($credentials, $remember)) {
            throw ValidationException::withMessages([
                'email' => 'Email atau password yang Anda masukkan salah.',
            ]);
        }

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'))
            ->with('success', 'Login berhasil. Selamat datang!');
    }

    /**
     * Proses logout pengguna.
     * Menghapus sesi aktif dan mengarahkan kembali ke halaman login.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
