<?php

namespace App\Http\Controllers;

use App\Enums\CustomerStatus;
use App\Enums\PaymentStatus;
use App\Models\Customer;
use App\Models\Invoice;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller: Dashboard.
 * Statistik dihitung langsung dari database (bukan mock).
 */
class DashboardController extends Controller
{
    /**
     * Label bulan singkat Bahasa Indonesia.
     *
     * @var array<int, string>
     */
    private const MONTHS = [
        1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr',
        5 => 'Mei', 6 => 'Jun', 7 => 'Jul', 8 => 'Agu',
        9 => 'Sep', 10 => 'Okt', 11 => 'Nov', 12 => 'Des',
    ];

    /**
     * Tampilkan dashboard + statistik pelanggan & tagihan.
     */
    public function index(): Response
    {
        $stats = [
            'totalCustomers' => Customer::count(),
            'activeCustomers' => Customer::where('status', CustomerStatus::Active->value)->count(),
            'suspendedCustomers' => Customer::where('status', CustomerStatus::Suspend->value)->count(),
            'disconnectedCustomers' => Customer::where('status', CustomerStatus::Disconnected->value)->count(),
            'totalUnpaidInvoices' => Invoice::where('payment_status', PaymentStatus::Unpaid->value)->count(),
        ];

        // 5 tagihan belum bayar terbaru untuk panel dashboard.
        $unpaidInvoices = Invoice::query()
            ->where('payment_status', PaymentStatus::Unpaid->value)
            ->with('customer')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn (Invoice $invoice) => [
                'id' => sprintf('INV-%s-%03d', $invoice->created_at?->format('Y') ?? now()->format('Y'), $invoice->id),
                'customer_name' => $invoice->customer?->name ?? '-',
                'billing_period' => $invoice->billing_period?->format('Y-m') ?? '',
                'amount' => (float) $invoice->amount,
            ]);

        // Jumlah tagihan per bulan (6 bulan terakhir yang tersedia).
        $monthlyInvoiceData = Invoice::query()
            ->selectRaw("DATE_FORMAT(billing_period, '%Y-%m') as period, COUNT(*) as total")
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->map(fn ($row) => [
                'month' => self::MONTHS[(int) Carbon::parse($row->period.'-01')->format('n')] ?? $row->period,
                'count' => (int) $row->total,
            ])
            ->values()
            ->all();

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'monthlyInvoiceData' => $monthlyInvoiceData,
            'unpaidInvoices' => $unpaidInvoices,
        ]);
    }
}
