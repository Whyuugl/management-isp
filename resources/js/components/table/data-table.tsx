import EmptyState from '@/components/common/empty-state';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export type Column<T> = {
    key: string;
    header: string | ReactNode;
    render: (row: T) => ReactNode;
    className?: string;
};

type DataTableProps<T> = {
    columns: Column<T>[];
    data: T[];
    keyExtractor: (row: T) => string | number;
    emptyMessage?: string;
    className?: string;
};

export default function DataTable<T>({
    columns,
    data,
    keyExtractor,
    emptyMessage = 'Tidak ada data',
    className,
}: DataTableProps<T>) {
    if (data.length === 0) {
        return <EmptyState title={emptyMessage} />;
    }

    return (
        <div className={cn('overflow-x-auto', className)}>
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-slate-200">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={cn(
                                    'px-4 py-3 font-medium whitespace-nowrap text-slate-500',
                                    col.className,
                                )}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr
                            key={keyExtractor(row)}
                            className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                        >
                            {columns.map((col) => (
                                <td
                                    key={col.key}
                                    className={cn(
                                        'px-4 py-3 whitespace-nowrap text-slate-700',
                                        col.className,
                                    )}
                                >
                                    {col.render(row)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
