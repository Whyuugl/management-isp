<?php

namespace App\Http\Controllers;

use App\Enums\CustomerStatus;
use App\Enums\PaymentStatus;
use App\Http\Requests\StoreInvoiceRequest;
use App\Models\Customer;
use App\Models\Invoice;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller: Modul Tagihan.
 *
 * Hak akses:
 * - Administrator: lihat, tambah, konfirmasi pembayaran.
 * - Staff: hanya melihat data tagihan.
 */
class InvoiceController extends Controller
{
    /**
     * Daftar tagihan + ringkasan untuk kartu statistik.
     */
    public function index(): Response
    {
        $invoices = Invoice::query()
            ->with('customer')
            ->orderByDesc('id')
            ->get()
            ->map(fn (Invoice $invoice) => [
                'id' => sprintf('INV-%s-%03d', $invoice->created_at?->format('Y') ?? now()->format('Y'), $invoice->id),
                'customer_id' => $invoice->customer_id,
                'customer_name' => $invoice->customer?->name ?? '-',
                'billing_period' => $invoice->billing_period?->format('Y-m') ?? '',
                'amount' => (float) $invoice->amount,
                'payment_status' => $invoice->payment_status,
                'paid_at' => $invoice->paid_at?->toIso8601String(),
                'created_at' => $invoice->created_at?->toIso8601String() ?? '',
            ]);

        $summary = [
            'total' => Invoice::count(),
            'unpaid' => Invoice::where('payment_status', PaymentStatus::Unpaid->value)->count(),
            'paid' => Invoice::where('payment_status', PaymentStatus::Paid->value)->count(),
            'unpaidAmount' => (float) Invoice::where('payment_status', PaymentStatus::Unpaid->value)->sum('amount'),
        ];

        // Hanya pelanggan aktif/suspend yang ditawarkan untuk tagihan baru.
        $customers = Customer::query()
            ->whereIn('status', [CustomerStatus::Active->value, CustomerStatus::Suspend->value])
            ->orderBy('name')
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

        return Inertia::render('tagihan', [
            'invoices' => $invoices,
            'summary' => $summary,
            'customers' => $customers,
        ]);
    }

    /**
     * Tambah tagihan baru. Status awal unpaid, paid_at null.
     */
    public function store(StoreInvoiceRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Invoice::create([
            'customer_id' => $validated['customer_id'],
            'billing_period' => Carbon::parse($validated['billing_period'].'-01')->startOfMonth(),
            'amount' => $validated['amount'],
            'payment_status' => PaymentStatus::Unpaid->value,
            'paid_at' => null,
        ]);

        return redirect()
            ->route('tagihan')
            ->with('success', 'Tagihan berhasil dibuat.');
    }

    /**
     * Konfirmasi pembayaran tagihan.
     * Tagihan yang sudah lunas tidak dapat dibayar ulang.
     */
    public function pay(Invoice $invoice): RedirectResponse
    {
        if ($invoice->payment_status === PaymentStatus::Paid->value) {
            return redirect()
                ->route('tagihan')
                ->with('error', 'Tagihan ini sudah lunas.');
        }

        $invoice->update([
            'payment_status' => PaymentStatus::Paid->value,
            'paid_at' => now(),
        ]);

        return redirect()
            ->route('tagihan')
            ->with('success', 'Pembayaran tagihan berhasil dikonfirmasi.');
    }
}
