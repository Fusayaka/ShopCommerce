interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

function getPaginationItems(current: number, total: number): (number | '...')[] {
    const items: (number | '...')[] = [];
    if (total <= 5) {
        for (let i = 1; i <= total; i++) items.push(i);
        return items;
    }
    items.push(1);
    if (current > 3) items.push('...');
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) items.push(i);
    if (total - 2 > current) items.push('...');
    items.push(total);
    return items;
}

export default function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
    if (totalPages <= 1) return null;

    const safePage = Math.min(Math.max(1, page), totalPages);
    const items = getPaginationItems(safePage, totalPages);

    const go = (p: number) => {
        if (p < 1 || p > totalPages || p === safePage) return;
        onPageChange(p);
    };

    const navBtn =
        'inline-flex cursor-pointer items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40';

    return (
        <div className={`flex flex-wrap items-center justify-center gap-1 ${className ?? ''}`}>
            <button type="button" onClick={() => go(safePage - 1)} disabled={safePage === 1} className={navBtn}>
                <span className="hidden sm:inline">Prev</span>
            </button>

            {items.map((item, i) =>
                item === '...' ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-slate-400">
                        …
                    </span>
                ) : (
                    <button
                        key={item}
                        type="button"
                        onClick={() => go(item)}
                        aria-current={item === safePage ? 'page' : undefined}
                        className={`min-w-8 cursor-pointer rounded-md border px-2 py-1.5 text-sm transition-colors ${
                            item === safePage
                                ? 'border-slate-900 bg-slate-900 text-white'
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        {item}
                    </button>
                ),
            )}

            <button
                type="button"
                onClick={() => go(safePage + 1)}
                disabled={safePage === totalPages}
                className={navBtn}
            >
                <span className="hidden sm:inline">Next</span>
            </button>
        </div>
    );
}
