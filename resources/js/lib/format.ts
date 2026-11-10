/**
 * Helper format tampilan (Bahasa Indonesia).
 */

/** Format angka menjadi "Rp 300.000". */
export function formatRupiah(value: number): string {
    return `Rp ${value.toLocaleString('id-ID')}`;
}

/** Format periode "2026-10" menjadi "Oktober 2026". */
export function formatBillingPeriod(period: string): string {
    const [year, month] = period.split('-').map(Number);

    if (!year || !month) {
        return period;
    }

    const date = new Date(year, month - 1, 1);

    return new Intl.DateTimeFormat('id-ID', {
        month: 'long',
        year: 'numeric',
    }).format(date);
}

/** Format tanggal ISO menjadi "09 Nov 2026, 14:30". */
export function formatDateTime(value: string | null): string {
    if (!value) {
        return '-';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
}
