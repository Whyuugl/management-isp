import { Badge } from '@/components/ui';
import type { Customer } from '@/types/customer';

/**
 * Badge status pelanggan.
 * Aktif: green, Suspend: yellow, Putus: red.
 */
export default function CustomerStatusBadge({
    status,
}: {
    status: Customer['status'];
}) {
    const variant =
        status === 'active'
            ? 'success'
            : status === 'suspend'
              ? 'warning'
              : 'danger';

    const label =
        status === 'active'
            ? 'Aktif'
            : status === 'suspend'
              ? 'Suspend'
              : 'Putus';

    return (
        <Badge variant={variant} className="capitalize">
            {label}
        </Badge>
    );
}
