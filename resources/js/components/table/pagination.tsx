import Button from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
    currentPage: number;
    lastPage: number;
    onPageChange: (page: number) => void;
    total?: number;
    from?: number;
    to?: number;
};

export default function Pagination({
    currentPage,
    lastPage,
    onPageChange,
    total,
    from,
    to,
}: PaginationProps) {
    if (lastPage <= 1) return null;

    return (
        <div className="flex flex-col items-center justify-between gap-3 px-4 py-3 sm:flex-row">
            {total !== undefined && from !== undefined && to !== undefined && (
                <p className="text-sm text-slate-500">
                    Menampilkan {from}–{to} dari {total}
                </p>
            )}
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: lastPage }, (_, i) => i + 1)
                    // ponytail: show max 7 page buttons; upgrade to ellipsis when pages > 7
                    .filter((p) => {
                        if (lastPage <= 7) return true;
                        if (p === 1 || p === lastPage) return true;
                        return Math.abs(p - currentPage) <= 1;
                    })
                    .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                        if (idx > 0 && p - (arr[idx - 1] ?? 0) > 1) {
                            acc.push('...');
                        }
                        acc.push(p);
                        return acc;
                    }, [])
                    .map((item, idx) =>
                        item === '...' ? (
                            <span
                                key={`ellipsis-${idx}`}
                                className="px-2 text-sm text-slate-400"
                            >
                                …
                            </span>
                        ) : (
                            <Button
                                key={item}
                                variant={
                                    item === currentPage ? 'primary' : 'ghost'
                                }
                                size="sm"
                                onClick={() => onPageChange(item)}
                            >
                                {item}
                            </Button>
                        ),
                    )}

                <Button
                    variant="ghost"
                    size="sm"
                    disabled={currentPage >= lastPage}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
