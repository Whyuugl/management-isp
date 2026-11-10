import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';

type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    containerClassName?: string;
};

export default function SearchInput({
    containerClassName,
    className,
    ...props
}: SearchInputProps) {
    return (
        <div className={cn('relative', containerClassName)}>
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
                type="search"
                className={cn(
                    'block w-full rounded-lg border border-slate-300 bg-white py-2 pr-3 pl-9 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
                    className,
                )}
                {...props}
            />
        </div>
    );
}
