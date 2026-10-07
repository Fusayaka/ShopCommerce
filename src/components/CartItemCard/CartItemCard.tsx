import trashIcon from '@/assets/trash-icon.png'
import plhImg from '/images/cloth-placeholder.jpeg'
import type { CartItem } from '@/types'

import './cartItemCard.css'

interface CartItemCardProps{
    item: CartItem;
    onUpdateQuantity: (id: number, newQuantity: number) => void;
    onRemoveItem: (id: number) => void;
}

export default function CartItemCard({item, onUpdateQuantity, onRemoveItem}: CartItemCardProps){
    const increase = () => onUpdateQuantity(item.id, item.quantity + 1);
    const decrease = () => {
        if (item.quantity <= 1){
            onRemoveItem(item.id);
        }
        else {
            onUpdateQuantity(item.id, item.quantity - 1);
        }
    };

    const currentTotalPrice = item.unitPrice * item.quantity;

    return (
        <div className="cart-item">
            <div className="cart-item-image">
                <img
                    src={item.image || plhImg}
                    alt={item.title}
                    onError={(e) => e.currentTarget.src = plhImg}
                />
            </div>

            <div className="cart-item-info">
                <div className="cart-item-header">
                    <h3 className="cart-item-title">{item.title}</h3>
                    <button
                        className="cart-item-delete"
                        onClick={() => onRemoveItem(item.id)}>
                        <img src={trashIcon} alt='Delete item'/>
                    </button>
                </div>

                <div className="cart-item-meta">
                    <p>Size: <span>{item.size}</span></p>
                    <p>Color: <span>{item.color}</span></p>
                    <p>Unit Price: <span>${item.unitPrice}</span></p>
                </div>

                <div className="cart-item-bottom">
                    <p className="cart-item-total">
                        Total Price <span>${currentTotalPrice}</span>
                    </p>

                    <div className="quantity-control">
                        <button onClick={decrease}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={increase}>+</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
