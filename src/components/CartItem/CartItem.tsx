import trashIcon from '@/assets/trash-icon.png'
import plhImg from '/images/cloth-placeholder.jpeg'
import type { OrderItem } from '@/types'

import './cartItem.css'

interface CartItemProps{
    item: OrderItem;
    onUpdateQuantity: (orderItemId: string, newQuantity: number) => void;
    onRemoveItem: (orderItemId: string) => void;
}

export default function CartItem({item, onUpdateQuantity, onRemoveItem}: CartItemProps){
    const increase = () => onUpdateQuantity(item.orderItemId, item.quantity + 1);
    const decrease = () => {
        if (item.quantity <= 1){
            onRemoveItem(item.orderItemId);
        }
        else {
            onUpdateQuantity(item.orderItemId, item.quantity - 1);
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
                        onClick={() => onRemoveItem(item.orderItemId)}>
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