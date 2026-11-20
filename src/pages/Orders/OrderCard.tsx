import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { Order, OrderStatus } from '@/types';
import { cartApi } from '@/api/cartApi';
import { formatPrice, formatDate, formatDateTime } from '@/utils/format';

const STATUS_STYLES: Record<OrderStatus, string> = {
    pending: 'bg-amber-50 text-amber-700 ring-amber-200',
    processing: 'bg-violet-100 text-violet-600 ring-violet-200',
    shipping: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
    delivered: 'bg-green-50 text-green-700 ring-green-200',
    cancelled: 'bg-red-50 text-red-700 ring-red-200',
    redelivery: 'bg-purple-50 text-purple-700 ring-purple-200',
};

interface OrderCardProps {
    order: Order;
    kind?: 'order' | 'redelivery';
    orderId?: number;
    reason?: string | null;
    onViewParentOrder?: (orderId: number) => void;
}

export default function OrderCard({ order, kind = 'order', orderId, reason, onViewParentOrder }: OrderCardProps) {
    const navigate = useNavigate();
    const [buyingAgain, setBuyingAgain] = useState(false);

    const viewParentOrder = () => {
        if (orderId == null) return;
        onViewParentOrder?.(orderId);
    };

    const handleBuyAgain = async () => {
        const items = order.items.filter((item) => typeof item.stockId === 'number');
        if (items.length === 0) {
            toast.info('These items are no longer available to re-order.');
            return;
        }
        setBuyingAgain(true);

        let addedCount = 0;
        const failedList: typeof items = [];

        try {
            for (const item of items){
                try {
                    await cartApi.addToCart({
                        stockId: item.stockId as number,
                        quantity: item.quantity,
                    })
                    addedCount++;
                } catch {
                    failedList.push(item);
                }
            }

            if (addedCount > 0 && failedList.length === 0){
                toast.success('Items added to your cart.');
                navigate('/cart');
            }
            else if (addedCount > 0){
                toast.warning(`Add ${addedCount} item${addedCount > 1 && 's'} to your cart. ${failedList.length} unavailable item${failedList.length > 1 ? 's were': ' was'} skipped.`);
                navigate('/cart');
            }
            else toast.error('None of the items from this order are available anymore.');
        } catch {
            // axiosClient surfaces the error toast.
        } finally {
            setBuyingAgain(false);
        }
    };

    const totalUnits = order.items.reduce((sum, item) => sum + item.quantity, 0);

    const statusColor = STATUS_STYLES[order.status]
        .split(' ')
        .filter((cls) => !cls.startsWith('bg-'))
        .join(' ');

    const label = kind === 'redelivery' ? 'Redelivery' : 'Order';

    return (
        <article
            id={kind === 'order' ? `order-card-${order.id}` : undefined}
            className="scroll-mt-20 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
            <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/70 px-5 py-3">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-900">
                        {label} #{order.id}
                    </span>
                    {order.createdAt && (
                        <span className="text-xs text-slate-500">{formatDate(order.createdAt, '')}</span>
                    )}
                </div>
                <span className="text-xs text-slate-500">
                    {totalUnits} item{totalUnits === 1 ? '' : 's'}
                </span>
            </header>

            {kind === 'redelivery' ? (
                <div className="flex flex-col gap-2 px-5 py-4 text-sm">
                    {orderId != null && (
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-slate-600">
                                <span className="font-semibold text-slate-800">Order ID:</span> #{orderId}
                            </span>
                            <button
                                type="button"
                                onClick={viewParentOrder}
                                className="shrink-0 cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                View in Order #{orderId}
                            </button>
                        </div>
                    )}
                    {reason && (
                        <p className="text-left m-0 text-slate-600">
                            <span className="font-semibold text-slate-800">Reason:</span> {reason}
                        </p>
                    )}
                </div>
            ) : (
            <ul className="m-0 flex list-none flex-col divide-y divide-slate-100 p-0">
                {order.items.map((item) => {
                    const lineTotal = item.totalPrice ?? item.priceAtPurchase * item.quantity;
                    const variant = item.stock
                        ? `Variation: ${item.stock.size} - ${item.stock.color}`
                        : '';
                    return (
                        <li key={item.id} className="flex items-center gap-4 px-5 py-4">
                            <div className="h-15 w-12 min-[400px]:w-14 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                                {item.image ? (
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
                                        No image
                                    </div>
                                )}
                            </div>

                            {/* Title + price at purchase */}
                            <div className="min-w-0 w-3/5 text-left">
                                <p className="m-0 line-clamp-2 text-sm font-semibold text-slate-900">
                                    {item.title}
                                </p>
                                {variant && <p className="m-0 mt-0.5 text-xs text-slate-500">{variant}</p>}
                                <p className="m-0 mt-1 text-xs text-slate-500">
                                    ${formatPrice(item.priceAtPurchase)}
                                </p>
                            </div>

                            {/* Units */}
                            <div className="md:w-16 shrink-0 text-center text-sm font-medium text-slate-600">
                                x{item.quantity}
                            </div>

                            {/* Line total */}
                            <div className="w-1/5 md:w-24 shrink-0 text-right text-sm font-semibold text-slate-900">
                                ${formatPrice(lineTotal)}
                            </div>
                        </li>
                    );
                })}
            </ul>
            )}

            {/* Footer*/}
            <footer className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/40 px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Status */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Status
                        </span>
                        <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold capitalize ring-[1px] ${statusColor}`}
                        >
                            {order.status}
                        </span>
                        <span className="group relative inline-flex">
                            <button
                                type="button"
                                aria-label={`Status last updated: ${formatDateTime(order.updatedAt ?? order.createdAt)}`}
                                className="flex h-4 w-4 cursor-help items-center justify-center rounded-full p-0 border-1 bg-slate-100 text-[10px] font-bold text-slate-600 outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                            >
                                ?
                            </button>
                            <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
                                Last updated: {formatDateTime(order.updatedAt ?? order.createdAt)}
                            </span>
                        </span>
                    </div>

                    {/* Total */}
                    <div className="flex items-baseline gap-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            <span className="hidden min-[400px]:inline">{label} </span>Total
                        </span>
                        <span className="text-base font-bold text-slate-900">
                            ${formatPrice(order.total)}
                        </span>
                    </div>
                </div>

                {/* Row 2: actions */}
                <div className="flex flex-wrap items-center justify-end gap-3">
                    {kind === 'order' && (
                        <button
                            type="button"
                            onClick={handleBuyAgain}
                            disabled={buyingAgain}
                            className="cursor-pointer rounded-lg border border-transparent bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {buyingAgain ? 'Adding…' : 'Buy again'}
                        </button>
                    )}

                    <button
                        type="button"
                        disabled
                        title="Not implemented yet"
                        className="cursor-not-allowed rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-400"
                    >
                        Contact shop
                    </button>
                </div>
            </footer>
        </article>
    );
}
