<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * Model: Pelanggan.
 *
 * @property int $id
 * @property string $name
 * @property string $phone
 * @property string $address
 * @property string $internet_package
 * @property float $package_price
 * @property string $status
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable(['name', 'phone', 'address', 'internet_package', 'package_price', 'status'])]
class Customer extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * Cast attributes to native types.
     */
    protected function casts(): array
    {
        return [
            'package_price' => 'float',
        ];
    }

    /**
     * Relationship: satu pelanggan memiliki banyak tagihan.
     */
    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
}
