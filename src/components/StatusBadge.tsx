import type { OrderStatus } from '@/types';
import { STATUS_STYLES } from '@/constants/order';

interface StatusBadgeProps {
    status: OrderStatus;
    className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[status]} ${className}`}
        >
            {status}
        </span>
    );
}
