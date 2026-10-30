import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderApi } from '@/api/orderApi';
import { promoApi } from '@/api/promoApi';
import type { PaymentMethod } from '@/types';
import { notifyCartChanged } from '@/utils/cartCount';
import promoIcon from '@/assets/promo-code.svg';
import './payment.css';

interface PaymentProps {
  subtotal: number;
  itemCount: number;
}

const PAYMENT_METHODS: { id: PaymentMethod; label: string; description: string }[] = [
  { id: 'delivery', label: 'Cash on Delivery (COD)', description: 'Pay with cash upon delivery' },
  { id: 'bank', label: 'Bank Transfer', description: 'Direct bank transfer to our store account' },
  { id: 'card', label: 'Credit / Debit Card', description: 'Pay securely using Visa, Mastercard, etc.' },
];

export default function Payment({ subtotal, itemCount }: PaymentProps) {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('delivery');
  const [isChangingMethod, setIsChangingMethod] = useState<boolean>(false);
  const [promoInput, setPromoInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discount, setdiscount] = useState<number>(0);
  const [validatingPromo, setValidatingPromo] = useState<boolean>(false);
  const [promoMessage, setPromoMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const safeSubtotal = Number(subtotal) || 0;
  const deliveryFee = safeSubtotal > 0 ? 15 : 0;
  const totalPayment = Math.max(0, safeSubtotal + deliveryFee - discount);

  const formatPrice = (val: number): string => {
    return `$${val.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleApplyPromo = async () => {
    setPromoMessage(null);
    const code = promoInput.trim();
    
    if (!code) {
      setPromoMessage({ text: 'Please enter a promo code.', type: 'error' });
      return;
    }

    if (appliedPromo === code) {
      setPromoMessage({ text: 'Promo code is already applied.', type: 'error' });
      return;
    }

    setValidatingPromo(true);
    try {
      const res = await promoApi.validateCode(code, safeSubtotal);
      const data = (res as any)?.data || res;

      if (data.isValid) {
        const discount = Number(data.discount || 0);
        setdiscount(discount);
        setAppliedPromo(code);
        setPromoMessage({
          text: `Applied successfully! Saved ${formatPrice(discount)}`,
          type: 'success',
        });
      } else {
        setdiscount(0);
        setAppliedPromo(null);
        setPromoMessage({
          text: data.message || 'Invalid or expired promo code.',
          type: 'error',
        });
      }
    } catch (err: unknown) {
      setdiscount(0);
      setAppliedPromo(null);
      const apiErr = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = apiErr?.response?.data?.message || apiErr?.message || 'Invalid or expired promo code.';
      setPromoMessage({ text: typeof msg === 'string' ? msg : 'Error validating code', type: 'error' });
    } finally {
      setValidatingPromo(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (itemCount === 0 || safeSubtotal === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    setSubmitting(true);
    try {
      await orderApi.createOrder({
        paymentMethod: selectedMethod,
        deliveryFee,
        promoCode: appliedPromo || undefined,
      });

      notifyCartChanged();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (err: unknown) {
      console.error('Failed to place order:', err);
      const apiErr = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = apiErr?.response?.data?.message || apiErr?.message || 'Failed to place order. Please try again.';
      toast.error(typeof msg === 'string' ? msg : 'Error processing order');
    } finally {
      setSubmitting(false);
    }
  };

  const activeMethodObj = PAYMENT_METHODS.find((m) => m.id === selectedMethod) || PAYMENT_METHODS[0];

  return (
    <div className="checkout-payment-section">
      <div className="payment-method-box">
        <div className="payment-method-left">
          <span className="payment-method-title">Payment Method</span>
        </div>

        <div className="payment-method-center">
          <span className="payment-method-name">{activeMethodObj.label}</span>
        </div>

        <div className="payment-method-right">
          <button
            type="button"
            className="change-method-btn"
            onClick={() => setIsChangingMethod((prev) => !prev)}
          >
            {isChangingMethod ? 'Done' : 'Change'}
          </button>
        </div>
      </div>

      {isChangingMethod && (
        <div className="payment-method-selector-panel">
          <p className="selector-heading">Select Payment Option:</p>
          <div className="selector-options">
            {PAYMENT_METHODS.map((method) => (
              <label
                key={method.id}
                className={`selector-option-card ${selectedMethod === method.id ? 'active' : ''}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={() => {
                    setSelectedMethod(method.id);
                    setIsChangingMethod(false);
                  }}
                />
                <div className="option-text">
                  <div className="option-label">{method.label}</div>
                  <div className="option-sub">{method.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="checkout-promo-wrapper">
        <div className="checkout-promo-input-group">
          <img src={promoIcon} alt="Promo" className="checkout-promo-icon" />
          <input
            type="text"
            placeholder="Add promo code"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
          />
          <button
            type="button"
            className="apply-promo-btn"
            disabled={validatingPromo}
            onClick={handleApplyPromo}
          >
            {validatingPromo ? 'Checking...' : 'Apply'}
          </button>
        </div>
        {promoMessage && (
          <p className={`checkout-promo-msg ${promoMessage.type}`}>{promoMessage.text}</p>
        )}
      </div>

      <div className="checkout-summary-section">
        <div className="checkout-summary-details">
          <div className="summary-row">
            <span className="summary-label">Subtotal</span>
            <span className="summary-val">{formatPrice(safeSubtotal)}</span>
          </div>

          <div className="summary-row">
            <span className="summary-label">Shipping</span>
            <span className="summary-val">{formatPrice(deliveryFee)}</span>
          </div>

          {discount > 0 && (
            <div className="summary-row discount">
              <span className="summary-label">Discount</span>
              <span className="summary-val">-{formatPrice(discount)}</span>
            </div>
          )}

          <div className="summary-divider-thick"></div>

          <div className="summary-row total-row">
            <span className="summary-label total-label">Total payment</span>
            <span className="summary-val total-val">{formatPrice(totalPayment)}</span>
          </div>

          <div className="place-order-wrapper">
            <button
              type="button"
              className="place-order-btn"
              disabled={submitting || itemCount === 0}
              onClick={handlePlaceOrder}
            >
              {submitting ? 'Placing Order...' : 'Place order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}