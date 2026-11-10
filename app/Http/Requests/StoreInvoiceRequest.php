<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Validasi tambah tagihan baru.
 * Status awal selalu unpaid dan paid_at null (diatur controller).
 */
class StoreInvoiceRequest extends FormRequest
{
    /**
     * Hanya Administrator yang boleh menambah tagihan.
     */
    public function authorize(): bool
    {
        return $this->user()?->isAdministrator() ?? false;
    }

    /**
     * Aturan validasi.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'customer_id' => ['required', 'integer', 'exists:customers,id'],
            'billing_period' => ['required', 'regex:/^\d{4}-\d{2}$/'],
            'amount' => ['required', 'numeric', 'gt:0'],
        ];
    }

    /**
     * Pesan validasi Bahasa Indonesia.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'customer_id.required' => 'Pelanggan wajib dipilih.',
            'customer_id.exists' => 'Pelanggan tidak ditemukan.',
            'billing_period.required' => 'Periode tagihan wajib diisi.',
            'billing_period.regex' => 'Format periode tagihan tidak valid.',
            'amount.required' => 'Nominal tagihan wajib diisi.',
            'amount.numeric' => 'Nominal tagihan harus berupa angka.',
            'amount.gt' => 'Nominal tagihan harus lebih besar dari 0.',
        ];
    }
}
