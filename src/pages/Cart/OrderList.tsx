import CartItem from '@/components/CartItem/CartItem';
import './orderList.css';
import type { OrderItem } from '@/types';

interface OrderListProps{
    items: OrderItem[];
    onUpdateQuantity: (orderItemId: string, newQuantiy: number) => void;
    onRemoveItem: (orderItemId: string) => void;
}

export default function OrderList({items, onUpdateQuantity, onRemoveItem}: OrderListProps) {
    return (
        <div className="order-list-box">
            {items.map((item) => (
                <CartItem 
                    key={`${item.orderItemId}`} 
                    item={item}
                    onRemoveItem={onRemoveItem}
                    onUpdateQuantity={onUpdateQuantity}
                />
            ))}
        </div>
    );
}