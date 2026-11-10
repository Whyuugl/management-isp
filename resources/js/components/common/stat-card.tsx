import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export type StatColor = 'blue' | 'emerald' | 'amber' | 'rose' | 'indigo';

type StatCardProps = {
    label: string;
    value: string | number;
    icon: LucideIcon;
    color?: StatColor;
    trend?: { value: string; positive: boolean };
    description?: string;
    className?: string;
};

const colorStyles: Record<
    StatColor,
    {
        bg: string;
        iconBg: string;
        iconText: string;
        glow: string;
    }
> = {
    blue: {
        bg: 'from-blue-50/50 to-white',
        iconBg: 'bg-blue-600 text-white shadow-sm shadow-blue-500/20',
        iconText: 'text-white',
        glow: 'hover:border-blue-300',
    },
    emerald: {
        bg: 'from-emerald-50/50 to-white',
        iconBg: 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20',
        iconText: 'text-white',
        glow: 'hover:border-emerald-300',
    },
    amber: {
        bg: 'from-amber-50/50 to-white',
        iconBg: 'bg-amber-500 text-white shadow-sm shadow-amber-500/20',
        iconText: 'text-white',
        glow: 'hover:border-amber-300',
    },
    rose: {
        bg: 'from-rose-50/50 to-white',
        iconBg: 'bg-rose-500 text-white shadow-sm shadow-rose-500/20',
        iconText: 'text-white',
        glow: 'hover:border-rose-300',
    },
    indigo: {
        bg: 'from-indigo-50/50 to-white',
        iconBg: 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20',
        iconText: 'text-white',
        glow: 'hover:border-indigo-300',
    },
};

/**
 * Kartu statistik dengan aksen visual halus, ikon kontras, dan hover glow.
 */
export default function StatCard({
    label,
    value,
    icon: Icon,
    color = 'blue',
    trend,
    description,
    className,
}: StatCardProps) {
    const scheme = colorStyles[color];

    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-b p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
                scheme.bg,
                scheme.glow,
                className,
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-slate-500">
                        {label}
                    </p>
                    <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                        {value}
                    </p>

                    {description && (
                        <p className="mt-1 text-xs text-slate-400">
                            {description}
                        </p>
                    )}

                    {trend && (
                        <p
                            className={cn(
                                'mt-1 inline-flex items-center gap-1 text-xs font-semibold',
                                trend.positive
                                    ? 'text-emerald-600'
                                    : 'text-rose-600',
                            )}
                        >
                            <span>{trend.positive ? '↑' : '↓'}</span>
                            <span>{trend.value}</span>
                        </p>
                    )}
                </div>

                <div
                    className={cn(
                        'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105',
                        scheme.iconBg,
                    )}
                >
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}
