import { SearchInput } from '@/components/common';
import { Select } from '@/components/ui';

type CustomerFiltersProps = {
    search: string;
    onSearchChange: (value: string) => void;
    statusFilter: string;
    onStatusFilterChange: (value: string) => void;
};

/**
 * Filter bar pelanggan: pencarian nama/telepon + filter status.
 */
export default function CustomerFilters({
    search,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
}: CustomerFiltersProps) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                <SearchInput
                    placeholder="Cari pelanggan (nama, telepon)..."
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
                            { value: 'active', label: 'Aktif' },
                            { value: 'suspend', label: 'Suspend' },
                            { value: 'disconnected', label: 'Putus' },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}
