export function formatPrice(value?: number | null): string {
    if (value === undefined || value === null) return '—';
    return Number(value).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
}

export function formatDate(value?: string, emptyDate: string = '—') {
    if (!value) return emptyDate;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return emptyDate;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDateTime(value?: string, emptyDateTime: string = '—'): string {
    if (!value) return emptyDateTime;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return emptyDateTime;
    return d.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}