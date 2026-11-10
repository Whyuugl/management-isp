<?php

use App\Http\Controllers\AuthenticatedSessionController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/**
 * --------------------------------------------------------------------------
 * Web Routes - Management ISP
 * --------------------------------------------------------------------------
 *
 * Kebijakan Hak Akses:
 * - Guest: halaman login.
 * - Authenticated: Dashboard, Pelanggan, Tagihan, Profil & Pengaturan.
 * - Administrator Only: Modul User, hapus pelanggan, kelola tagihan.
 */

// 1. Rute Autentikasi (Guest Only)
Route::middleware('guest')->group(function (): void {
    Route::get('/', [AuthenticatedSessionController::class, 'create'])->name('home');
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

// 2. Rute Terproteksi (Harus Login)
Route::middleware('auth')->group(function (): void {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    // Dashboard — Administrator & Staff
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Modul Pelanggan — Staff boleh melihat, menambah, mengubah
    Route::get('/pelanggan', [CustomerController::class, 'index'])->name('pelanggan');
    Route::post('/pelanggan', [CustomerController::class, 'store'])->name('pelanggan.store');
    Route::put('/pelanggan/{customer}', [CustomerController::class, 'update'])->name('pelanggan.update');

    // Modul Tagihan — Staff hanya melihat
    Route::get('/tagihan', [InvoiceController::class, 'index'])->name('tagihan');

    // Profil & Pengaturan Akun (Staff & Administrator)
    Route::get('/profil', [ProfileController::class, 'edit'])->name('profil');
    Route::post('/profil/password', [ProfileController::class, 'updatePassword'])->name('profil.password');
    Route::get('/pengaturan', [ProfileController::class, 'settings'])->name('pengaturan');

    // 3. Administrator Only
    Route::middleware('role.administrator')->group(function (): void {
        // Hapus pelanggan
        Route::delete('/pelanggan/{customer}', [CustomerController::class, 'destroy'])->name('pelanggan.destroy');

        // Tambah & konfirmasi pembayaran tagihan
        Route::post('/tagihan', [InvoiceController::class, 'store'])->name('tagihan.store');
        Route::put('/tagihan/{invoice}/pay', [InvoiceController::class, 'pay'])->name('tagihan.pay');

        // Modul User
        Route::get('/users', [UserController::class, 'index'])->name('users');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    });
});
