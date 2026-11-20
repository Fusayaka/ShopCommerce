import type { OrderStatus, PaymentMethod } from "@/types";

export const ALL_STATUSES: OrderStatus[] = [
    'pending',
    'processing',
    'shipping',
    'delivered',
    'cancelled',
    'redelivery',
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
    pending: 'Pending',
    processing: 'Processing',
    shipping: 'Shipping',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    redelivery: 'Redelivery',
};

export const STATUS_STYLES: Record<OrderStatus, string> = {
    pending: 'bg-amber-50 text-amber-700',
    processing: 'bg-violet-100 text-violet-500',
    shipping: 'bg-indigo-50 text-indigo-700',
    delivered: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-700',
    redelivery: 'bg-purple-50 text-purple-700',
};

export const NEXT_STATUS: Record<OrderStatus, OrderStatus[]> = {
    pending: ['processing', 'cancelled'],
    redelivery: ['processing', 'cancelled'],
    processing: ['shipping', 'cancelled'],
    shipping: ['delivered', 'cancelled'],
    delivered: [],
    cancelled: [],
};

export type TabKey = OrderStatus | 'all';

export const TABS: { key: TabKey; label: string }[] = [
    { key: 'all', label: 'All' },
    ...ALL_STATUSES.map((status) => ({ key: status, label: STATUS_LABELS[status] })),
];

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
    delivery: 'Cash on delivery',
    bank: 'Bank transfer',
    card: 'Credit / debit card',
};

export const PAYMENT_METHODS: { id: PaymentMethod; label: string; description: string }[] = [
    { id: 'delivery', label: 'Cash on Delivery (COD)', description: 'Pay with cash upon delivery' },
    { id: 'bank', label: 'Bank Transfer', description: 'Direct bank transfer to our store account' },
    { id: 'card', label: 'Credit / Debit Card', description: 'Pay securely using Visa, Mastercard, etc.' },
];
