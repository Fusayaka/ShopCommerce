export function formatPrice(value?: number | null): string {
    if (value === undefined || value === null) return '—';
    return Number(value).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
}

