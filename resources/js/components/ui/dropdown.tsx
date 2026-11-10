import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

type DropdownProps = {
    trigger: ReactNode;
    children: ReactNode;
    align?: 'left' | 'right';
    className?: string;
};

export default function Dropdown({
    trigger,
    children,
    align = 'right',
    className,
}: DropdownProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const close = useCallback(() => setOpen(false), []);

    useEffect(() => {
        if (!open) return;

        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                close();
            }
        }

        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [open, close]);

    return (
        <div ref={ref} className="relative inline-block">
            <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
            {open && (
                <div
                    className={cn(
                        'absolute z-30 mt-2 min-w-[13rem] rounded-2xl border border-slate-200/80 bg-white p-1.5 shadow-xl shadow-slate-900/10 backdrop-blur-sm',
                        align === 'right' ? 'right-0' : 'left-0',
                        className,
                    )}
                    onClick={close}
                >
                    {children}
                </div>
            )}
        </div>
    );
}

type DropdownItemProps = {
    children: ReactNode;
    onClick?: () => void;
    href?: string;
    danger?: boolean;
    className?: string;
};

export function DropdownItem({
    children,
    onClick,
    href,
    danger = false,
    className,
}: DropdownItemProps) {
    const commonClass = cn(
        'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
        danger
            ? 'text-rose-600 hover:bg-rose-50'
            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
        className,
    );

    if (href) {
        return (
            <Link href={href} className={commonClass}>
                {children}
            </Link>
        );
    }

    return (
        <button type="button" onClick={onClick} className={commonClass}>
            {children}
        </button>
    );
}
