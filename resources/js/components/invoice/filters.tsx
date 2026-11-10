import { SearchInput } from '@/components/common';
import { Select } from '@/components/ui';

type InvoiceFiltersProps = {
    search: string;
    onSearchChange: (value: string) => void;
    statusFilter: string;
    onStatusFilterChange: (value: string) => void;
    periodFilter: string;
    onPeriodFilterChange: (value: string) => void;
    periodOptions: { value: string; label: string }[];
};

/**
 * Filter bar tagihan:
 * - Search nama pelanggan
 * - Filter status pembayaran (Semua, Lunas, Belum Bayar)
 * - Filter periode tagihan (dinamis dari data yang ada)
 */
export default function InvoiceFilters({
    search,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    periodFilter,
    onPeriodFilterChange,
    periodOptions,
}: InvoiceFiltersProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                <SearchInput
                    placeholder="Cari pelanggan..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    containerClassName="w-full sm:max-w-xs"
                />

                <div className="w-full sm:w-44">
                    <Select
                        value={statusFilter}
                        onChange={(e) => onStatusFilterChange(e.target.value)}
                        placeholder="Semua Status"
                        options={[
                            { value: 'unpaid', label: 'Belum Bayar' },
                            { value: 'paid', label: 'Lunas' },
                        ]}
                    />
                </div>

                <div className="w-full sm:w-48">
                    <Select
                        value={periodFilter}
                        onChange={(e) => onPeriodFilterChange(e.target.value)}
                        placeholder="Semua Periode"
                        options={periodOptions}
                    />
                </div>
            </div>
        </div>
    );
}
