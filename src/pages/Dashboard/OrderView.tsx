import type { Order, OrderStatus, PaymentMethod, RedeliveryOrder } from '@/types';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { orderApi } from '@/api/orderApi';
import { RedeliveryForm, type RedeliveryFormData } from './Form';

interface OrderDetailModalProps {
    order: Order | null;
    onClose: () => void;
    /** Called after a status change or redelivery create/update so the list can refresh. */
    onChanged?: () => void;
}

const STATUS_STYLES: Record<OrderStatus, string> = {
    pending: 'bg-amber-50 text-amber-700',
    processing: 'bg-violet-100 text-violet-500',
    shipping: 'bg-indigo-50 text-indigo-700',
    delivered: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-700',
    redelivery: 'bg-purple-50 text-purple-700',
};

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
    delivery: 'Cash on delivery',
    bank: 'Bank transfer',
    card: 'Credit / debit card',
};

const NEXT_STATUS: Record<OrderStatus, OrderStatus[]> = {
    pending: ['processing', 'cancelled'],
    redelivery: ['processing', 'cancelled'],
    processing: ['shipping', 'cancelled'],
    shipping: ['delivered', 'cancelled'],
    delivered: [],
    cancelled: [],
};

function formatPrice(value?: number | null) {
    if (value === undefined || value === null) return '—';
    return `${Number(value).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;
}

function formatDate(value?: string) {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getTotalItems(order: Order) {
    return order.items.reduce((count, item) => count + item.quantity, 0);
}

function StatusBadge({ status }: { status: OrderStatus }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[status]}`}
        >
            {status}
        </span>
    );
}

type Tab = 'items' | 'redeliver';

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose, onChanged }) => {
    const [tab, setTab] = useState<Tab>('items');
    const [status, setStatus] = useState<OrderStatus>(order?.status ?? 'pending');

    const [targetStatus, setTargetStatus] = useState<OrderStatus | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const [redeliveries, setRedeliveries] = useState<RedeliveryOrder[] | null>(null);
    const [loadingReds, setLoadingReds] = useState(false);
    const [redsError, setRedsError] = useState(false);

    const [creating, setCreating] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [redeliveryTargets, setRedeliveryTargets] = useState<Record<number, OrderStatus>>({});
    const [updatingRedeliveryId, setUpdatingRedeliveryId] = useState<number | null>(null);

    const [noteRedelivery, setNoteRedelivery] = useState<RedeliveryOrder | null>(null);
    const [noteDraft, setNoteDraft] = useState('');
    const [reasonDraft, setReasonDraft] = useState('');
    const [savingNote, setSavingNote] = useState(false);

    // Close on Escape.
    useEffect(() => {
        if (!order) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [order, onClose]);

    // Lazy-load redeliveries the first time the Redeliver tab is opened.
    useEffect(() => {
        if (!order || tab !== 'redeliver' || redeliveries !== null) return;
        let cancelled = false;
        (async () => {
            setLoadingReds(true);
            setRedsError(false);
            try {
                const res = await orderApi.getOrderRedeliveries(order.id);
                if (!cancelled) setRedeliveries(res?.data ?? []);
            } catch (err) {
                console.error('Failed to load redeliveries:', err);
                if (!cancelled) {
                    setRedeliveries([]);
                    setRedsError(true);
                }
            } finally {
                if (!cancelled) setLoadingReds(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [order, tab, redeliveries]);

    if (!order) return null;

    const badgeClass = STATUS_STYLES[status];
    const address = order.address ?? order.user?.address ?? '—';
    const contact = order.contact ?? order.user?.contact ?? '—';
    const paymentLabel = order.paymentMethod ? PAYMENT_LABELS[order.paymentMethod] : '—';

    const knownReds = redeliveries ?? order.redeliveries ?? [];
    const hasActiveRedelivery = knownReds.some((r) => r.status !== 'cancelled');
    const canRedeliver = status === 'cancelled' && !hasActiveRedelivery;
    const statusOptions = NEXT_STATUS[status];
    const canUpdateStatus = statusOptions.length > 0;
    const selectedStatus =
        targetStatus && statusOptions.includes(targetStatus) ? targetStatus : statusOptions[0];

    const applyStatus = async (next: OrderStatus) => {
        setUpdatingStatus(true);
        try {
            await orderApi.updateOrder(order.id, { status: next });
            toast.success(`Order #${order.id} → ${next}`);
            setStatus(next);
            setTargetStatus(null);
            onChanged?.();
        } catch (err) {
            console.error('Failed to update order status:', err);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const submitRedeliver = async (data: RedeliveryFormData) => {
        setSubmitting(true);
        try {
            await orderApi.createRedelivery(order.id, {
                reason: data.reason,
                note: data.note || undefined,
                address: data.address || undefined,
                contact: data.contact || undefined,
            });
            toast.success(`Redelivery created for order #${order.id}`);
            setCreating(false);
            try {
                const res = await orderApi.getOrderRedeliveries(order.id);
                setRedeliveries(res?.data ?? []);
            } catch (err) {
                console.error('Failed to refresh redeliveries:', err);
            }
            onChanged?.();
        } catch (err) {
            console.error('Failed to create redelivery:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const applyRedeliveryStatus = async (r: RedeliveryOrder, next: OrderStatus) => {
        setUpdatingRedeliveryId(r.id);
        try {
            await orderApi.updateRedelivery(r.id, { status: next });
            toast.success(`Redelivery status #${r.id} to ${next}`);
            setRedeliveries((prev) =>
                prev ? prev.map((x) => (x.id === r.id ? { ...x, status: next } : x)) : prev,
            );
            setRedeliveryTargets((prev) => {
                const rest = { ...prev };
                delete rest[r.id];
                return rest;
            });
            onChanged?.();
        } catch (err) {
            console.error('Failed to update redelivery status:', err);
        } finally {
            setUpdatingRedeliveryId(null);
        }
    };

    const openNote = (r: RedeliveryOrder) => {
        setNoteRedelivery(r);
        setNoteDraft(r.note ?? '');
        setReasonDraft(r.reason ?? '');
    };

    const saveNote = async () => {
        if (!noteRedelivery) return;
        const r = noteRedelivery;
        const note = noteDraft.trim();
        const reason = reasonDraft.trim();
        setSavingNote(true);
        try {
            await orderApi.updateRedelivery(r.id, {
                note: note || undefined,
                reason: reason || undefined,
            });
            toast.success(`Saved redelivery #${r.id}`);
            setRedeliveries((prev) =>
                prev ? prev.map((x) => (x.id === r.id ? { ...x, note, reason } : x)) : prev,
            );
            setNoteRedelivery(null);
        } catch (err) {
            console.error('Failed to save redelivery note:', err);
        } finally {
            setSavingNote(false);
        }
    };

    const tabBtn = (key: Tab) =>
        `relative cursor-pointer border-none bg-transparent px-4 py-2.5 text-sm font-semibold transition-colors ${
            tab === key ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'
        }`;

    return (
        <>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[1px]"
                onClick={onClose}
            >
                <div
                    className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/70 px-6 py-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <h2 className="text-base font-bold text-slate-900">Order #{order.id}</h2>
                            <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${badgeClass}`}
                            >
                                {status}
                            </span>
                            {order.createdAt && (
                                <span className="text-xs text-slate-500">{formatDate(order.createdAt)}</span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close modal"
                                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-transparent text-slate-500 transition hover:border-slate-200 hover:bg-white hover:text-slate-900"
                            >
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 border-b border-slate-200 px-4">
                        <button type="button" className={tabBtn('items')} onClick={() => setTab('items')}>
                            Items
                            {tab === 'items' && (
                                <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-slate-900" />
                            )}
                        </button>
                        <button type="button" className={tabBtn('redeliver')} onClick={() => setTab('redeliver')}>
                            Redeliver
                            {knownReds.length > 0 && (
                                <span className="ml-1.5 inline-flex items-center rounded-full bg-slate-200 px-1.5 text-[10px] font-bold text-slate-600">
                                    {knownReds.length}
                                </span>
                            )}
                            {tab === 'redeliver' && (
                                <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-slate-900" />
                            )}
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {tab === 'items' ? (
                            <div className="grid grid-cols-1 lg:grid-cols-12">
                                <div className="flex flex-col border-b border-slate-200 px-6 py-4 lg:col-span-8 lg:border-b-0 lg:border-r">
                                    <div className="mb-2 flex items-center justify-between gap-2">
                                        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-800">
                                            <svg className="h-4 w-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                            Order Items ({getTotalItems(order)})
                                        </h3>
                                        {canUpdateStatus && (
                                            <div className="flex shrink-0 items-center gap-2">
                                                <select
                                                    value={selectedStatus}
                                                    onChange={(e) => setTargetStatus(e.target.value as OrderStatus)}
                                                    disabled={updatingStatus}
                                                    className="cursor-pointer rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold capitalize text-slate-700 outline-none focus:border-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {statusOptions.map((s) => (
                                                        <option key={s} value={s} className="capitalize">
                                                            {s}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={() => selectedStatus && applyStatus(selectedStatus)}
                                                    disabled={updatingStatus || !selectedStatus}
                                                    className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {updatingStatus ? 'Updating…' : 'Update status'}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                                        <table className="w-full border-collapse text-left text-sm">
                                            <thead>
                                                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                    <th className="px-4 py-3">Product</th>
                                                    <th className="px-3 py-3 text-center">Size</th>
                                                    <th className="px-3 py-3 text-center">Color</th>
                                                    <th className="px-3 py-3 text-center">Units</th>
                                                    <th className="px-4 py-3 text-right">Price ($)</th>
                                                    <th className="px-4 py-3 text-right">Total ($)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200">
                                                {order.items.map((item) => (
                                                    <tr key={item.id} className="hover:bg-slate-50/60">
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                                                                    {item.image ? (
                                                                        <img
                                                                            src={item.image}
                                                                            alt={item.title}
                                                                            className="h-full w-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                                                                            No img
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <p className="line-clamp-2 font-medium text-slate-900">
                                                                        {item.title}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td className="px-3 py-3 text-center text-slate-600">
                                                            {item.stock?.size ? (
                                                                <span className="px-2 py-0.5 text-xs font-medium">
                                                                    {item.stock.size}
                                                                </span>
                                                            ) : (
                                                                '—'
                                                            )}
                                                        </td>

                                                        <td className="px-3 py-3 text-center text-slate-600">
                                                            {item.stock?.color || '—'}
                                                        </td>

                                                        <td className="px-3 py-3 text-center font-semibold text-slate-800">
                                                            {item.quantity}
                                                        </td>

                                                        <td className="px-4 py-3 text-center text-slate-600">
                                                            {formatPrice(item.priceAtPurchase)}
                                                        </td>

                                                        <td className="px-4 py-3 text-right font-semibold text-slate-900">
                                                            {formatPrice(
                                                                item.totalPrice ?? item.priceAtPurchase * item.quantity,
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-between bg-slate-50/40 px-6 py-4 lg:col-span-4">
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="mt-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                                                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="2" y="5" width="20" height="14" rx="2" />
                                                    <line x1="2" y1="10" x2="22" y2="10" />
                                                </svg>
                                                Payment
                                            </h4>
                                            <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm">
                                                <span className="font-medium text-slate-800">{paymentLabel}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                                                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                                    <circle cx="12" cy="7" r="4" />
                                                </svg>
                                                Contact
                                            </h4>
                                            <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-3.5 text-sm">
                                                {order.user?.name && (
                                                    <div className="flex items-start gap-2">
                                                        <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                                            <circle cx="12" cy="7" r="4" />
                                                        </svg>
                                                        <div>
                                                            <p className="pl-2 text-left text-xs text-slate-400">Customer</p>
                                                            <p className="pl-2 text-left font-medium text-slate-800">{order.user.name}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex items-start gap-2">
                                                    <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                                                        <circle cx="12" cy="10" r="3" />
                                                    </svg>
                                                    <div>
                                                        <p className="pl-2 text-left text-xs text-slate-400">Address</p>
                                                        <p className="pl-2 text-left leading-relaxed text-slate-700">{address}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-2">
                                                    <svg className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                                                    </svg>
                                                    <div>
                                                        <p className="pl-2 text-left text-xs text-slate-400">Contact</p>
                                                        <p className="pl-2 text-left font-medium text-slate-800">{contact}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 border-t border-slate-200 pt-4">
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center justify-between text-slate-600">
                                                <span>Subtotal</span>
                                                <span className="font-medium text-slate-800">${formatPrice(order.subtotal)}</span>
                                            </div>
                                            {order.discount > 0 && (
                                                <div className="flex items-center justify-between text-slate-600">
                                                    <span>Discount</span>
                                                    <span className="font-medium text-red-600">
                                                        -${formatPrice(order.discount)}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between text-slate-600">
                                                <span>Shipping</span>
                                                <span className="font-medium text-slate-800">
                                                    {order.deliveryFee === 0 ? 'Free' : '$' + formatPrice(order.deliveryFee)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between border-t border-slate-200 pt-2.5 text-base font-bold text-slate-900">
                                                <span>Total</span>
                                                <span>${formatPrice(order.total)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-800">
                                        <svg className="h-4 w-4 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Redeliveries{redeliveries ? ` (${redeliveries.length})` : ''}
                                    </h3>
                                    {canRedeliver && (
                                        <button
                                            type="button"
                                            onClick={() => setCreating(true)}
                                            className="inline-flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-md border border-transparent bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
                                        >
                                            + New redelivery
                                        </button>
                                    )}
                                </div>

                                {status !== 'cancelled' && (
                                    <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
                                        A redelivery can only be created once the order is cancelled.
                                    </p>
                                )}

                                {loadingReds ? (
                                    <p className="py-8 text-center text-sm text-slate-400">Loading redeliveries…</p>
                                ) : redsError ? (
                                    <p className="py-8 text-center text-sm text-red-600">
                                        Failed to load redeliveries. Please try again.
                                    </p>
                                ) : !redeliveries || redeliveries.length === 0 ? (
                                    <p className="py-8 text-center text-sm text-slate-400">
                                        No redeliveries for this order yet.
                                    </p>
                                ) : (
                                    <ul className="flex flex-col gap-3 py-0 p-0 m-0">
                                        {redeliveries.map((r) => (
                                            <li
                                                key={r.id}
                                                className="rounded-lg border border-slate-200 bg-white p-4 text-left list-none"
                                            >
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-slate-800">R#{r.id}</span>
                                                        <StatusBadge status={r.status} />
                                                    </div>
                                                    <span className="text-xs text-slate-500">
                                                        {formatDate(r.createdAt)}
                                                    </span>
                                                </div>

                                                <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
                                                    <div>
                                                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                            Reason
                                                        </dt>
                                                        <dd className="text-slate-700 ml-0">{r.reason || '—'}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                            Address
                                                        </dt>
                                                        <dd className="text-slate-700 ml-0">{r.address || '—'}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                            Contact
                                                        </dt>
                                                        <dd className="text-slate-700 ml-0">{r.contact || '—'}</dd>
                                                    </div>
                                                    <div className="sm:col-span-2">
                                                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                            Note
                                                        </dt>
                                                        <dd className="text-slate-700 ml-0">{r.note || 'Empty'}</dd>
                                                    </div>
                                                </dl>

                                                <div className="mt-3 flex items-center justify-end gap-2">
                                                    {(() => {
                                                        const opts = NEXT_STATUS[r.status];
                                                        if (opts.length === 0) return null;
                                                        const target = redeliveryTargets[r.id];
                                                        const sel = target && opts.includes(target) ? target : opts[0];
                                                        const busy = updatingRedeliveryId === r.id;
                                                        return (
                                                            <>
                                                                <select
                                                                    value={sel}
                                                                    onChange={(e) =>
                                                                        setRedeliveryTargets((prev) => ({
                                                                            ...prev,
                                                                            [r.id]: e.target.value as OrderStatus,
                                                                        }))
                                                                    }
                                                                    disabled={busy}
                                                                    className="cursor-pointer rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold capitalize text-slate-700 outline-none focus:border-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                                                                >
                                                                    {opts.map((s) => (
                                                                        <option key={s} value={s} className="capitalize">
                                                                            {s}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => applyRedeliveryStatus(r, sel)}
                                                                    disabled={busy}
                                                                    className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                                                >
                                                                    {busy ? 'Updating…' : 'Update status'}
                                                                </button>
                                                            </>
                                                        );
                                                    })()}
                                                    <button
                                                        type="button"
                                                        onClick={() => openNote(r)}
                                                        className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                                    >
                                                        {r.note ? 'Edit note' : 'Note'}
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>


            {noteRedelivery && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
                    onClick={() => !savingNote && setNoteRedelivery(null)}
                >
                    <div
                        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-base font-bold text-slate-900">Redelivery #{noteRedelivery.id}</h3>

                        <label className="mt-4 block pl-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Reason
                        </label>
                        <input
                            type="text"
                            value={reasonDraft}
                            onChange={(e) => setReasonDraft(e.target.value)}
                            disabled={savingNote}
                            maxLength={100}
                            placeholder="Reason for this redelivery…"
                            className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-900 disabled:opacity-50"
                        />
                        <div className="mt-1 text-right text-xs text-slate-400">{reasonDraft.length}/100</div>

                        <label className="mt-3 block pl-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Note
                        </label>
                        <textarea
                            value={noteDraft}
                            onChange={(e) => setNoteDraft(e.target.value)}
                            disabled={savingNote}
                            rows={4}
                            maxLength={255}
                            placeholder="Add a note for this redelivery…"
                            className="mt-1.5 w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-900 disabled:opacity-50"
                        />
                        <div className="mt-1 text-right text-xs text-slate-400">{noteDraft.length}/255</div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setNoteRedelivery(null)}
                                disabled={savingNote}
                                className="cursor-pointer rounded-md border border-slate-300 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={saveNote}
                                disabled={savingNote}
                                className="cursor-pointer rounded-md border border-transparent bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {savingNote ? 'Saving…' : 'Save note'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {creating && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
                    onClick={() => !submitting && setCreating(false)}
                >
                    <div
                        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <RedeliveryForm
                            orderId={order.id}
                            isSubmitting={submitting}
                            currentAddress={order.address ?? order.user?.address}
                            currentContact={order.contact ?? order.user?.contact}
                            onSubmit={submitRedeliver}
                            onCancel={() => setCreating(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderDetailModal;
