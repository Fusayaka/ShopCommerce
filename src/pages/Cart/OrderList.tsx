import { CartItemCard } from '@/components';
import './orderList.css';
import type { CartItem } from '@/types';

interface OrderListProps{
    items: CartItem[];
    onUpdateQuantity: (item: CartItem, newQuantity: number) => void;
    onRemoveItem: (item: CartItem) => void;
}

export default function OrderList({items, onUpdateQuantity, onRemoveItem}: OrderListProps) {
    return (
        <div className="order-list-box">
            {items.map((item) => (
                <CartItemCard
                    key={item.id}
                    item={item}
                    onRemoveItem={onRemoveItem}
                    onUpdateQuantity={onUpdateQuantity}
                />
            ))}
        </div>
    );
}
