<?php

namespace App\Http\Controllers;

use App\Enums\CustomerStatus;
use App\Http\Requests\CustomerRequest;
use App\Models\Customer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller: Modul Pelanggan.
 *
 * Hak akses:
 * - Administrator: lihat, tambah, ubah, hapus pelanggan.
 * - Staff: lihat, tambah, ubah pelanggan (TIDAK boleh hapus).
 */
class CustomerController extends Controller
{
    /**
     * Daftar pelanggan (soft-deleted otomatis tidak tampil).
     */
    public function index(): Response
    {
        $customers = Customer::query()
            ->orderBy('id')
            ->get()
            ->map(fn (Customer $customer) => [
                'id' => $customer->id,
                'name' => $customer->name,
                'phone' => $customer->phone,
                'address' => $customer->address,
                'package' => $customer->internet_package,
                'price' => (float) $customer->package_price,
                'status' => $customer->status,
            ]);

        $summary = [
            'total' => Customer::count(),
            'active' => Customer::where('status', CustomerStatus::Active->value)->count(),
            'suspend' => Customer::where('status', CustomerStatus::Suspend->value)->count(),
            'disconnected' => Customer::where('status', CustomerStatus::Disconnected->value)->count(),
        ];

        return Inertia::render('pelanggan', [
            'customers' => $customers,
            'summary' => $summary,
        ]);
    }

    /**
     * Tambah pelanggan baru.
     */
    public function store(CustomerRequest $request): RedirectResponse
    {
        Customer::create($request->validated());

        return redirect()
            ->route('pelanggan')
            ->with('success', 'Pelanggan berhasil ditambahkan.');
    }

    /**
     * Ubah data pelanggan.
     */
    public function update(CustomerRequest $request, Customer $customer): RedirectResponse
    {
        $customer->update($request->validated());

        return redirect()
            ->route('pelanggan')
            ->with('success', 'Data pelanggan berhasil diperbarui.');
    }

    /**
     * Hapus pelanggan (soft delete).
     * Hanya Administrator yang diizinkan.
     */
    public function destroy(Customer $customer): RedirectResponse
    {
        if (! Auth::user()?->isAdministrator()) {
            return redirect()
                ->route('pelanggan')
                ->with('error', 'Anda tidak memiliki izin untuk menghapus pelanggan.');
        }

        $customer->delete();

        return redirect()
            ->route('pelanggan')
            ->with('success', 'Pelanggan berhasil dihapus.');
    }
}
