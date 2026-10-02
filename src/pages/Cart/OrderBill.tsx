import promo from '@/assets/promo-code.png';
import type { OrderItem } from '@/types';
import './orderBill.css';
import { useState } from 'react';

const PROMO_CODE: Record<string, number> = {
    "abc" : .1,
    "gear" : .05,
    "cloth" : .15,
    "temp" : .15,
    "a" : .01,
}

interface OrderBillProps{
    items: OrderItem[];
}

function getDeliveryFee() {
    return 15;
}

export default function OrderBill({items}: OrderBillProps) {
    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const [discountRate, setDiscountRate] = useState<number>(0);
    const [promoInput, setPromoInput] = useState("");
    const [appliedCode, setAppliedCode] = useState<string | null>(null);
    const [message, setMessage] = useState<{text: string; type: 'success' | 'error'} | null>(null);

    const discount = subtotal * discountRate;
    const deliveryFee = getDeliveryFee();
    const total = subtotal - discount + deliveryFee;

    const formatPrice = (price: number) =>
        price.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });

    const handlePromoCode = () => {
        setMessage(null);
        const code = promoInput.trim().toLowerCase();
        if (!code){
            setMessage({text: "Type Promo Code", type: 'error'});
            return
        }
        if (!(code in PROMO_CODE)){
            setMessage({text: "Invalid Promo Code or expired Promo Code", type: 'error'});
        }
        else if (appliedCode != code){
            setDiscountRate(PROMO_CODE[code]);
            setAppliedCode(code);
            setMessage({text: `Discount ${PROMO_CODE[code] * 100}%`, type: 'success'});
        }
        else{
            setMessage({text: "Promo Code already in use", type: 'error'});
        }
    };

    return (
        <div className="order-bill-box">
            <h2 className="bill-title">Order Summary</h2>
            
            <div className="bill-row">
                <span className="bill-label">Subtotal</span>
                <span className="bill-value">${formatPrice(subtotal)}</span>
            </div>
            
            <div className="bill-row">
                <span className="bill-label">Discount (-{discountRate* 100}%)</span>
                <span className="bill-value discount">-${formatPrice(discount)}</span>
            </div>
            
            <div className="bill-row">
                <span className="bill-label">Delivery Fee</span>
                <span className="bill-value">${deliveryFee}</span>
            </div>
            
            <div className="bill-divider"></div>
            
            <div className="bill-row bill-total">
                <span>Total</span>
                <span>${formatPrice(total)}</span>
            </div>

            <div className="promo-box">
                <img src={promo} alt="Promo code" className="promo-icon-img" />
                <input 
                    type="text" 
                    placeholder="Add promo code"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                />
                <button 
                    className="apply-btn" 
                    onClick={handlePromoCode}
                >
                    Apply
                </button>
            </div>

            {message && (
                <p style={{ 
                    color: message.type === 'success' ? '#2e7d32' : '#ff3333', 
                    fontSize: '13px', 
                    marginTop: '-12px', 
                    marginBottom: '16px', 
                    textAlign: 'left' 
                }}>
                    {message.text}
                </p>
            )}

            <button className="checkout-btn">
                Go to Checkout <span className="arrow">→</span>
            </button>
        </div>
    );
}