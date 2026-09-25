import trashIcon from '@/assets/trash-icon.png'
import plhImg from '/images/cloth-placeholder.jpeg'
import type { OrderItem } from '@/types'
import { useState } from 'react';
import './cartItem.css'

interface CartItemProps{
    item: OrderItem;
}

export default function CartItem({item}: CartItemProps){
    const [quantity, setQuantity] = useState(item.quantity);
    const increase = () => setQuantity(prev => prev + 1);
    const decrease = () => {
        if (quantity <= 1){
            // Delete
        }
        else {
            setQuantity(prev => prev - 1);
        }
    };

    const currentTotalPrice = item.unitPrice * quantity;

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
                    <button className="cart-item-delete">
                        <img src={trashIcon}/>
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
                        <span>{quantity}</span>
                        <button onClick={increase}>+</button>
                    </div>
                </div>
            </div>
        </div>
    );
}