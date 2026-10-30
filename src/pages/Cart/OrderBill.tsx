import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import promo from '@/assets/promo-code.svg';
import { promoApi } from '@/api/promoApi';
import type { CartLineItem } from '@/types';
import './orderBill.css';

interface OrderBillProps {
  items: CartLineItem[];
}

function getDeliveryFee() {
  return 15;
}

export default function OrderBill({ items }: OrderBillProps) {
  const navigate = useNavigate();

  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.unitPrice) || 0) * (Number(item.quantity) || 0),
    0
  );

  const [discount, setDiscount] = useState<number>(0);
  const [promoInput, setPromoInput] = useState<string>('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [validatingPromo, setValidatingPromo] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const deliveryFee = subtotal > 0 ? getDeliveryFee() : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const formatPrice = (price: number) =>
    price.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  useEffect(() => {
    if (!appliedCode) return;

    if (subtotal === 0) {
      setDiscount(0);
      setAppliedCode(null);
      setMessage(null);
      return;
    }

    const revalidatePromo = async () => {
      try {
        const res = await promoApi.validateCode(appliedCode, subtotal);
        const data = (res as any)?.data || res;

        if (data.isValid) {
          const newDiscount = Number(data.discount || data.discount || 0);
          setDiscount(newDiscount);
          setMessage({
            text: `Discount saved: $${formatPrice(newDiscount)}`,
            type: 'success',
          });
        } else {
          setDiscount(0);
          setAppliedCode(null);
          setMessage({
            text: data.message || 'Promo code no longer applicable for this order amount.',
            type: 'error',
          });
        }
      } catch {
        setDiscount(0);
        setAppliedCode(null);
        setMessage({
          text: 'Promo code no longer applicable for this order amount.',
          type: 'error',
        });
      }
    };

    revalidatePromo();
  }, [subtotal]);

  const handlePromoCode = async () => {
    setMessage(null);
    const code = promoInput.trim();

    if (!code) {
      setMessage({ text: 'Please type a promo code.', type: 'error' });
      return;
    }

    if (appliedCode === code) {
      setMessage({ text: 'Promo code already in use.', type: 'error' });
      return;
    }

    setValidatingPromo(true);
    try {
      const res = await promoApi.validateCode(code, subtotal);
      const data = (res as any)?.data || res;

      if (data.isValid) {
        const discount = Number(data.discount || data.discount || 0);
        setDiscount(discount);
        setAppliedCode(code);
        setMessage({
          text: `Applied code! Saved $${formatPrice(discount)}`,
          type: 'success',
        });
      } else {
        setDiscount(0);
        setAppliedCode(null);
        setMessage({
          text: data.message || 'Invalid or expired promo code.',
          type: 'error',
        });
      }
    } catch (err: unknown) {
      setDiscount(0);
      setAppliedCode(null);
      const apiErr = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = apiErr?.response?.data?.message || apiErr?.message || 'Invalid or expired promo code.';
      setMessage({ text: typeof msg === 'string' ? msg : 'Error validating promo code', type: 'error' });
    } finally {
      setValidatingPromo(false);
    }
  };

  return (
    <div className="order-bill-box">
      <h2 className="bill-title">Order Summary</h2>

      <div className="bill-row">
        <span className="bill-label">Subtotal</span>
        <span className="bill-value">${formatPrice(subtotal)}</span>
      </div>

      {discount > 0 && (
        <div className="bill-row">
          <span className="bill-label">Discount</span>
          <span className="bill-value discount">-${formatPrice(discount)}</span>
        </div>
      )}

      <div className="bill-row">
        <span className="bill-label">Delivery Fee</span>
        <span className="bill-value">${formatPrice(deliveryFee)}</span>
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
          type="button"
          disabled={validatingPromo}
          onClick={handlePromoCode}
        >
          {validatingPromo ? '...' : 'Apply'}
        </button>
      </div>

      {message && (
        <p
          style={{
            color: message.type === 'success' ? '#2e7d32' : '#ff3333',
            fontSize: '13px',
            marginTop: '-12px',
            marginBottom: '16px',
            textAlign: 'left',
          }}
        >
          {message.text}
        </p>
      )}

      <button className="checkout-btn" onClick={() => navigate('/checkout')}>
        Go to Checkout <span className="arrow">→</span>
      </button>
    </div>
  );
}