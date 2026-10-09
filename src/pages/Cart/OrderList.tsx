import { CartItemCard } from '@/components';
import './orderList.css';
import type { CartLineItem } from '@/types';

interface OrderListProps{
    items: CartLineItem[];
    onUpdateQuantity: (item: CartLineItem, newQuantity: number) => void;
    onRemoveItem: (item: CartLineItem) => void;
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
