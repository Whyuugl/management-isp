<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller: Modul Manajemen User.
 *
 * Hak Akses: KHUSUS ADMINISTRATOR.
 * Dilindungi oleh middleware 'role.administrator' di layer routing,
 * serta otorisasi di dalam FormRequest (StoreUserRequest & UpdateUserRequest).
 *
 * Fitur:
 * - index: Daftar user (Nama, Email, Role, Tanggal Dibuat).
 * - store: Tambah user baru (Nama, Email, Password, Role).
 * - update: Edit data user (Administrator dapat mengubah data pengguna).
 * - destroy: Hapus user (Administrator dapat menghapus pengguna, cegah hapus akun sendiri).
 */
class UserController extends Controller
{
    /**
     * Tampilkan daftar seluruh pengguna.
     * Mengambil kolom sesuai spesifikasi: id, name, email, role, created_at.
     */
    public function index(Request $request): Response
    {
        $users = User::query()
            ->select(['id', 'name', 'email', 'role', 'created_at'])
            ->latest('id')
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->value,
                'roleLabel' => $user->role->label(),
                'createdAt' => $user->created_at?->format('d M Y, H:i') ?? '-',
            ]);

        return Inertia::render('users', [
            'users' => $users,
        ]);
    }

    /**
     * Simpan pengguna baru ke database.
     *
     * Fitur: Tambah User.
     * Validasi: nama, email unik, password terenkripsi, role enum.
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return redirect()->route('users')->with('success', 'Pengguna baru berhasil ditambahkan.');
    }

    /**
     * Perbarui data pengguna yang sudah ada.
     *
     * Fitur: Edit User.
     * Password hanya diubah jika administrator mengisi field password baru.
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $validated = $request->validated();

        $payload = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
        ];

        // Update password hanya jika diisi
        if (! empty($validated['password'])) {
            $payload['password'] = Hash::make($validated['password']);
        }

        $user->update($payload);

        return redirect()->route('users')->with('success', 'Data pengguna berhasil diperbarui.');
    }

    /**
     * Hapus akun pengguna dari sistem.
     *
     * Fitur: Hapus User.
     * Aturan Bisnis: Administrator tidak boleh menghapus akunnya sendiri yang sedang aktif.
     */
    public function destroy(User $user): RedirectResponse
    {
        // Cegah administrator menghapus akun sendiri
        if ($user->id === Auth::id()) {
            return redirect()->route('users')->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $user->delete();

        return redirect()->route('users')->with('success', 'Pengguna berhasil dihapus.');
    }
}
