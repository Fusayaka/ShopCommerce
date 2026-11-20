import { CartItemCard } from '@/components';
import type { CartLineItem } from '@/types';

interface OrderListProps{
    items: CartLineItem[];
    onUpdateQuantity: (item: CartLineItem, newQuantity: number) => void;
    onRemoveItem: (item: CartLineItem) => void;
}

export default function OrderList({items, onUpdateQuantity, onRemoveItem}: OrderListProps) {
    return (
        <div className="box-border flex flex-col rounded-[20px] border border-[#e0e0e0] bg-white py-6 px-2 text-left max-md:rounded-2xl max-md:p-4">
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
