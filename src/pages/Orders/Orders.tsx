import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import avatarPlaceholder from '@/assets/avatar-placeholder.svg';
import { orderApi } from '@/api/orderApi';
import { useAuth } from '@/utils/auth';
import type { Order } from '@/types';
import OrderCard from './OrderCard';
import { TABS, type TabKey } from '@/constants/order';
import { CONFIG } from '@/config';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const PAGE_SIZE = CONFIG.DEFAULT_PAGE_SIZE;

const matchesTab = (c: { kind: 'order' | 'redelivery'; order: Order }, tab: TabKey) =>
    tab === 'all'
        ? true
        : tab === 'redelivery'
          ? c.kind === 'redelivery'
          : c.kind === 'order' && c.order.status === tab;

export default function Orders() {
    const { loggedIn, user } = useAuth();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [activeTab, setActiveTab] = useState<TabKey>('all');
    const [search, setSearch] = useState('');

    const [visibleOrder, setVisibleOrder] = useState(PAGE_SIZE);
    const sentinelRef = useRef<HTMLDivElement>(null);

    const pendingScrollRef = useRef<number | null>(null);

    const cards = useMemo(() => {
        const list: {
            key: string;
            kind: 'order' | 'redelivery';
            order: Order;
            orderId?: number;
            reason?: string | null;
        }[] = [];
        for (const o of orders) {
            for (const r of o.redeliveries ?? []) {
                list.push({
                    key: `redelivery-${r.id}`,
                    kind: 'redelivery',
                    orderId: o.id,
                    reason: r.reason,
                    order: {
                        ...o,
                        id: r.id,
                        status: r.status,
                        total: r.total ?? o.total,
                        createdAt: r.createdAt,
                        updatedAt: r.updatedAt,
                        redeliveries: undefined,
                    },
                });
            }
            list.push({ key: `order-${o.id}`, kind: 'order', order: o });
        }
        return list;
    }, [orders]);

    const counts = useMemo(() => {
        const map: Record<string, number> = {};
        for (const { key } of TABS) map[key] = cards.filter((c) => matchesTab(c, key)).length;
        return map;
    }, [cards]);

    const filteredCards = useMemo(() => {
        const q = search.trim().replace(/^#/, '').toLowerCase();
        const idQuery = /^\d+$/.test(q) ? Number(q) : null;
        return cards.filter((c) => {
            if (!matchesTab(c, activeTab)) return false;
            if (!q) return true;
            if (idQuery !== null) {
                const owningOrderId = c.kind === 'order' ? c.order.id : c.orderId;
                if (owningOrderId === idQuery) return true;
                if (c.kind === 'redelivery' && c.order.id === idQuery) return true;
            }
            return c.order.items.some((item) => item.title.toLowerCase().includes(q));
        });
    }, [cards, activeTab, search]);

    const fetchOrders = useCallback(async () => {
        try {
            const res = await orderApi.getUserOrders();
            setOrders(res?.data ?? []);
            setError(false);
        } catch {
            setError(true);
        }
    }, []);

    const visibleCards = useMemo(
        () => filteredCards.slice(0, visibleOrder),
        [filteredCards, visibleOrder],
    );
    const hasMore = visibleOrder < filteredCards.length;

    useEffect(() => {
        if (!hasMore) return;
        const curr = sentinelRef.current;
        if (!curr) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setVisibleOrder((c) => c + PAGE_SIZE);
            },
            { rootMargin: '200px' },
        );
        obs.observe(curr);
        return () => obs.disconnect();
    }, [hasMore, filteredCards.length]);

    const changeTab = (key: TabKey) => {
        setActiveTab(key);
        setVisibleOrder(PAGE_SIZE);
    };

    const changeSearch = (value: string) => {
        setSearch(value);
        setVisibleOrder(PAGE_SIZE);
    };

    useEffect(() => {
        if (!loggedIn) return;
        let active = true;
        (async () => {
            await fetchOrders();
            if (active) setLoading(false);
        })();
        return () => {
            active = false;
        };
    }, [loggedIn, fetchOrders]);

    const handleRefresh = async () => {
        setLoading(true);
        await fetchOrders();
        setLoading(false);
    };

    const scrollToOrderCard = (orderId: number) => {
        const el = document.getElementById(`order-card-${orderId}`);
        if (!el) return false;
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return true;
    };

    const handleViewParentOrder = (orderId: number) => {
        const index = cards.findIndex((c) => c.kind === 'order' && c.order.id === orderId);
        if (index === -1) return;

        const needsReveal =
            search.trim() !== '' || activeTab !== 'all' || visibleOrder < index + 1;

        setSearch('');
        setActiveTab('all');
        setVisibleOrder((curr) => Math.max(curr, index + 1));

        if (needsReveal) {
            pendingScrollRef.current = orderId;
        } else {
            scrollToOrderCard(orderId);
        }
    };

    useEffect(() => {
        if (pendingScrollRef.current == null) return;
        if (scrollToOrderCard(pendingScrollRef.current)) {
            pendingScrollRef.current = null;
        }
    }, [visibleCards]);

    if (!loggedIn) return <Navigate to="/login" replace />;

    return (
        <div data-orders className="min-h-[70vh] w-full bg-slate-50 py-6 text-slate-800">
            <nav className='mb-6 px-7.5 text-left text-sm text-[#666] md:px-[5%] [&_a]:text-[#666] [&_a]:no-underline [&_a]:transition-colors [&_a:hover]:text-black [&_a:hover]:underline'>
                <Link to={ROUTES.HOME}>Home</Link> {' > '}
                <span className="font-medium text-black">My Orders</span>
            </nav>
            <div className="mx-auto flex w-full flex-col gap-6 px-7.5 md:px-[5%] lg:flex-row">
                {/* User info sidebar*/}
                <aside className="w-full shrink-0 lg:w-1/5 lg:max-w-[20%] mt-20">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
                        <div className="flex flex-col items-center text-center">
                            <img
                                src={user.avatar || avatarPlaceholder}
                                alt={user.name || 'User'}
                                onError={(e) => {
                                    e.currentTarget.src = avatarPlaceholder;
                                }}
                                className="h-20 w-20 rounded-full border border-slate-200 object-cover"
                            />
                            <p className="m-0 mt-3 text-base font-bold text-slate-900">
                                {user.name || 'User'}
                            </p>
                            {user.email && (
                                <p className="m-0 mt-0.5 break-all text-xs text-slate-500">{user.email}</p>
                            )}
                        </div>

                        <dl className="m-0 mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 text-left">
                            <div>
                                <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 pl-1.5 md:pl-0">
                                    Contact
                                </dt>
                                <dd className="m-0 mt-0.5 text-sm text-slate-700 pl-1.5 md:pl-0">
                                    {user.contact || 'Not provided'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 pl-1.5 md:pl-0">
                                    Address
                                </dt>
                                <dd className="m-0 mt-0.5 text-sm leading-relaxed text-slate-700 pl-1.5 md:pl-0">
                                    {user.address || 'Not provided'}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </aside>

                {/* Order list */}
                <main className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                        <h1 className="m-0 text-xl font-bold text-slate-900 pl-2 md:pl-4">My Orders</h1>
                        <button
                            type="button"
                            onClick={handleRefresh}
                            disabled={loading}
                            aria-label="Refresh orders"
                            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <svg
                                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            Refresh
                        </button>
                    </div>

                    {!loading && !error && orders.length > 0 && (
                        <div className="mt-4 flex flex-col gap-3">
                            <div className="relative">
                                <svg
                                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <circle cx="11" cy="11" r="7" />
                                    <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
                                </svg>
                                <input
                                    type="search"
                                    value={search}
                                    onChange={(e) => changeSearch(e.target.value)}
                                    placeholder="Search by order ID, redeliver ID or product name…"
                                    className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 outline-none focus:border-slate-400"
                                />
                            </div>

                            <div className="
                                                flex gap-2 overflow-x-auto pb-1.5 md:flex-wrap md:pb-0 
                                                [&::-webkit-scrollbar]:h-0.5 [&::-webkit-scrollbar-track]:bg-transparent
                                                [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300
                            ">
                                {TABS.map((tab) => {
                                    const active = activeTab === tab.key;
                                    const count = counts[tab.key] ?? 0;
                                    return (
                                        <button
                                            key={tab.key}
                                            type="button"
                                            onClick={() => changeTab(tab.key)}
                                            className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                                                active
                                                    ? 'bg-slate-900 text-white'
                                                    : 'bg-white text-slate-600 border border-slate-900 hover:bg-slate-100'
                                            }`}
                                        >
                                            {tab.label}
                                            <span
                                                className={`rounded-full px-1.5 text-[10px] ${
                                                    active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                                                }`}
                                            >
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="mt-4">
                        {loading ? (
                            <div className="flex flex-col gap-4">
                                {[0, 1].map((i) => (
                                    <div
                                        key={i}
                                        className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-white"
                                    />
                                ))}
                            </div>
                        ) : error ? (
                            <div className="rounded-2xl border border-dashed border-red-200 bg-red-50 px-6 py-12 text-center">
                                <p className="m-0 text-sm font-medium text-red-600">
                                    We couldn't load your orders.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleRefresh}
                                    className="mt-3 cursor-pointer rounded-lg border border-transparent bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                                >
                                    Try again
                                </button>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
                                <p className="m-0 text-sm font-medium text-slate-700">No orders yet</p>
                            </div>
                        ) : filteredCards.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
                                <p className="m-0 text-sm font-medium text-slate-700">No matching orders</p>
                                <p className="m-0 mt-1 text-xs text-slate-500">
                                    Try a different search or status filter.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {visibleCards.map((c) => (
                                    <OrderCard
                                        key={c.key}
                                        order={c.order}
                                        kind={c.kind}
                                        orderId={c.orderId}
                                        reason={c.reason}
                                        onViewParentOrder={handleViewParentOrder}
                                    />
                                ))}
                                {hasMore && (
                                    <div
                                        ref={sentinelRef}
                                        className="flex justify-center py-4 text-xs text-slate-400"
                                    >
                                        Loading more ...
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
