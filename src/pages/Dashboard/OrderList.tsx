import { useEffect, useMemo, useState } from 'react';
import { orderApi } from '@/api/orderApi';
import type { Order, OrderStatus } from '@/types';
import { Pagination } from '@/components';
import { OrderDetailModal } from './OrderView';
import { useSearchParams } from 'react-router-dom';

const STATUS_STYLES: Record<OrderStatus, string> = {
    pending: 'bg-amber-50 text-amber-700',
    processing: 'bg-violet-100 text-violet-500',
    shipping: 'bg-indigo-50 text-indigo-700',
    delivered: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-700',
    redelivery: 'bg-purple-50 text-purple-700',
};

const ALL_STATUSES: OrderStatus[] = [
    'pending',
    'processing',
    'shipping',
    'delivered',
    'cancelled',
    'redelivery',
];

type SortKey = 'date' | 'status';
type SortDir = 'asc' | 'desc';

const LIMIT = 10;

function formatPrice(value?: number | null) {
    if (value === undefined || value === null) return '—';
    return `${Number(value).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;
}

function formatDate(value?: string) {
    if (!value) return '—';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function StatusBadge({ status }: { status: OrderStatus }) {
    return (
        <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[status]}`}
        >
            {status}
        </span>
    );
}

export default function OrderList() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadToken, setReloadToken] = useState<number>(0);

    const [searchParams, setSearchParams] = useSearchParams();

    const [search, setSearch] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
    const [sortKey, setSortKey] = useState<SortKey>('date');
    const [sortDir, setSortDir] = useState<SortDir>(() => {
        const d = searchParams.get('date');
        return d === 'asc' || d === 'desc' ? d : 'desc';
    });
    const [page, setPage] = useState<number>(1);

    const [viewOrder, setViewOrder] = useState<Order | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await orderApi.getAllOrders();
                if (cancelled) return;
                setOrders(Array.isArray(res) ? res : []);
                setError(null);
            } catch (err) {
                console.error('Failed to load orders:', err);
                if (!cancelled) setError('Failed to load orders. Please try again.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [reloadToken]);

    const toggleSort = (key: SortKey) => {
        const nextKey = key;
        const nextDir: SortDir = sortKey === key ? (sortDir === 'asc' ? 'desc' : 'asc') : 'desc';

        setSortKey(nextKey);
        setSortDir(nextDir);
        setPage(1);

        const searchParam = new URLSearchParams(searchParams);
        searchParam.delete('page');
        if (nextKey === 'date') {
            searchParam.set('date', nextDir);
        } else {
            searchParam.delete('date');
        }
        setSearchParams(searchParam);
    };

    const changeFilter = (value: OrderStatus | 'all') => {
        setStatusFilter(value);
        setPage(1);
    };

    const changeSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const visibleOrders = useMemo(() => {
        const idQuery = search.trim().replace(/^#/, '');
        const filtered = orders.filter((o) => {
            if (statusFilter !== 'all' && o.status !== statusFilter) return false;
            if (idQuery && !String(o.id).includes(idQuery)) return false;
            return true;
        });
        const sorted = [...filtered].sort((a, b) => {
            const cmp =
                sortKey === 'date'
                    ? new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime()
                    : a.status.localeCompare(b.status);
            return sortDir === 'asc' ? cmp : -cmp;
        });
        return sorted;
    }, [orders, search, statusFilter, sortKey, sortDir]);

    const lastPage = Math.max(1, Math.ceil(visibleOrders.length / LIMIT));
    const safePage = Math.min(page, lastPage);

    const pagedOrders = useMemo(
        () => visibleOrders.slice((safePage - 1) * LIMIT, safePage * LIMIT),
        [visibleOrders, safePage],
    );

    const goToPage = (p: number) => {
        if (p < 1 || p > lastPage || p === safePage) return;
        setPage(p);

        const searchParam = new URLSearchParams(searchParams);
        if (p === 1) searchParam.delete('page');
        else searchParam.set('page', p.toString());
        setSearchParams(searchParam);
    };

    const sortArrow = (key: SortKey) => {
        if (sortKey !== key) return '↕';
        return sortDir === 'asc' ? '↑' : '↓';
    };

    return (
        <section className="flex flex-1 flex-col gap-5">
            <header className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 pl-4">Orders</h1>
                    <p className="text-sm text-slate-500 text-left pl-5">
                        {loading ? 'Loading…' : `${visibleOrders.length} order${visibleOrders.length === 1 ? '' : 's'}`}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        inputMode="numeric"
                        value={search}
                        onChange={(e) => changeSearch(e.target.value)}
                        placeholder="Search by order ID"
                        className="w-44 h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-900"
                    />
                    <label className="text-xs font-medium text-slate-500">Status</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => changeFilter(e.target.value as OrderStatus | 'all')}
                        className="h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm capitalize text-slate-800 outline-none focus:border-slate-900"
                    >
                        <option value="all">All</option>
                        {ALL_STATUSES.map((s) => (
                            <option key={s} value={s} className="capitalize">
                                {s}
                            </option>
                        ))}
                    </select>
                </div>
            </header>

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                {error ? (
                    <div className="p-8 text-center text-sm text-red-600">{error}</div>
                ) : loading ? (
                    <div className="p-8 text-center text-sm text-slate-400">Loading orders…</div>
                ) : visibleOrders.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-400">No orders found.</div>
                ) : (
                    <>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-center text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                                    <th className="px-4 py-3 font-semibold">ID</th>
                                    <th className="px-4 py-3 font-semibold">Customer</th>
                                    <th className="px-4 py-3 font-semibold">
                                        <button
                                            type="button"
                                            onClick={() => toggleSort('date')}
                                            className="inline-flex cursor-pointer items-center justify-center gap-1 border-none bg-transparent p-0 align-middle text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-900"
                                        >
                                            Date <span className="text-slate-400">{sortArrow('date')}</span>
                                        </button>
                                    </th>
                                    <th className="px-4 py-3 font-semibold">Address</th>
                                    <th className="px-4 py-3 font-semibold">Contact</th>
                                    <th className="px-4 py-3 font-semibold">Total ($)</th>
                                    <th className="px-4 py-3 font-semibold">
                                        <button
                                            type="button"
                                            onClick={() => toggleSort('status')}
                                            className="inline-flex cursor-pointer items-center justify-center gap-1 border-none bg-transparent p-0 align-middle text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-900"
                                        >
                                            Status <span className="text-slate-400">{sortArrow('status')}</span>
                                        </button>
                                    </th>
                                    <th className="w-28 px-4 py-3 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pagedOrders.map((order) => {
                                    const address = order.address ?? order.user?.address ?? '—';
                                    const contact = order.contact ?? order.user?.contact ?? '—';
                                    return (
                                        <tr
                                            key={order.id}
                                            className="border-b border-slate-100 align-center transition-colors hover:bg-slate-50"
                                        >
                                            <td className="px-4 py-3 font-medium text-slate-900">#{order.id}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    {order.user?.avatar ? (
                                                        <img
                                                            src={order.user.avatar}
                                                            alt={order.user?.name ?? 'Customer'}
                                                            className="h-8 w-8 shrink-0 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                                                            {(order.user?.name?.trim()?.[0] ?? 'U').toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <p className="truncate text-left font-medium text-slate-800">
                                                            {order.user?.name ?? `User #${order.userId}`}
                                                        </p>
                                                        {order.user?.email && (
                                                            <p className="truncate text-left text-xs text-slate-400">
                                                                {order.user.email}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">
                                                <div>{formatDate(order.createdAt)}</div>
                                                {order.updatedAt && order.updatedAt !== order.createdAt && (
                                                    <div className="text-xs text-slate-400">
                                                        upd. {formatDate(order.updatedAt)}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 max-w-48 truncate text-slate-600">
                                                {address}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">{contact}</td>
                                            <td className="px-4 py-3 font-medium text-slate-700">
                                                {formatPrice(order.total)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusBadge status={order.status} />
                                            </td>
                                            <td className="w-28 px-4 py-3">
                                                <div className="flex items-center justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => setViewOrder(order)}
                                                        className="inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                                    >
                                                        Detail
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {lastPage > 1 && (
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm">
                            <span className="text-slate-500">
                                Page {safePage} of {lastPage}
                            </span>
                            <Pagination page={safePage} totalPages={lastPage} onPageChange={goToPage} />
                        </div>
                    )}
                    </>
                )}
            </div>

            <OrderDetailModal
                key={viewOrder?.id ?? 'none'}
                order={viewOrder}
                onClose={() => setViewOrder(null)}
                onChanged={() => setReloadToken((t) => t + 1)}
            />
        </section>
    );
}
