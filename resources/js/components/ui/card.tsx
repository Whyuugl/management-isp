import { cn } from '@/lib/utils';
import type { HTMLAttributes, ReactNode } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
    padding?: boolean;
};

export default function Card({
    children,
    padding = true,
    className,
    ...props
}: CardProps) {
    return (
        <div
            className={cn(
                'rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
                padding && 'p-6',
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}
