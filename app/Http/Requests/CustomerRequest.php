<?php

namespace App\Http\Requests;

use App\Enums\CustomerStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validasi tambah / ubah pelanggan.
 * Digunakan oleh CustomerController@store dan @update.
 */
class CustomerRequest extends FormRequest
{
    /**
     * Semua pengguna yang sudah login boleh menambah/mengubah pelanggan.
     * Staff: boleh tambah & ubah pelanggan.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Aturan validasi.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'address' => ['required', 'string'],
            'internet_package' => ['required', 'string', 'max:100'],
            'package_price' => ['required', 'numeric', 'gt:0'],
            'status' => ['required', Rule::enum(CustomerStatus::class)],
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
            'name.required' => 'Nama pelanggan wajib diisi.',
            'phone.required' => 'Nomor telepon wajib diisi.',
            'phone.max' => 'Nomor telepon maksimal 20 karakter.',
            'address.required' => 'Alamat wajib diisi.',
            'internet_package.required' => 'Paket internet wajib diisi.',
            'package_price.required' => 'Harga paket wajib diisi.',
            'package_price.numeric' => 'Harga paket harus berupa angka.',
            'package_price.gt' => 'Harga paket harus lebih besar dari 0.',
            'status.required' => 'Status pelanggan wajib dipilih.',
            'status.enum' => 'Status pelanggan tidak valid.',
        ];
    }
}
