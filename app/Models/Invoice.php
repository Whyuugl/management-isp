<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * Model: Tagihan.
 *
 * @property int $id
 * @property int $customer_id
 * @property Carbon $billing_period
 * @property float $amount
 * @property string $payment_status
 * @property Carbon|null $paid_at
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
#[Fillable(['customer_id', 'billing_period', 'amount', 'payment_status', 'paid_at'])]
class Invoice extends Model
{
    use HasFactory;

    /**
     * Cast attributes ke tipe native.
     */
    protected function casts(): array
    {
        return [
            'billing_period' => 'date',
            'amount' => 'float',
            'paid_at' => 'datetime',
        ];
    }

    /**
     * Relationship: tagihan milik satu pelanggan.
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class)->withTrashed();
    }
}
