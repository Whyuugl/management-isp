import { PackageOpen } from 'lucide-react';
import type { ReactNode } from 'react';

type EmptyStateProps = {
    title: string;
    description?: string;
    action?: ReactNode;
    icon?: ReactNode;
};

export default function EmptyState({
    title,
    description,
    action,
    icon,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-slate-300">
                {icon ?? <PackageOpen className="h-12 w-12" />}
            </div>
            <h3 className="mt-4 text-base font-medium text-slate-900">
                {title}
            </h3>
            {description && (
                <p className="mt-1 max-w-sm text-sm text-slate-500">
                    {description}
                </p>
            )}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}
