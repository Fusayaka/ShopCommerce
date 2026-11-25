import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import promo from '@/assets/promo-code.svg';
import { promoApi } from '@/api/promoApi';
import type { CartLineItem } from '@/types';
import { formatPrice } from '@/utils/format';
import { DELIVERY_FEE } from '@/constants/commerce';
import { ROUTES } from '@/constants/routes';

interface OrderBillProps {
  items: CartLineItem[];
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

  const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  useEffect(() => {
    if (!appliedCode) return;

    const revalidatePromo = async () => {
      if (subtotal === 0) {
        setDiscount(0);
        setAppliedCode(null);
        setMessage(null);
        return;
      }

      try {
        const data = await promoApi.validateCode(appliedCode, subtotal);

        if (data.isValid) {
          const newDiscount = Number(data.discount || 0);
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
  }, [subtotal, appliedCode]);

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
      const data = await promoApi.validateCode(code, subtotal);

      if (data.isValid) {
        const discount = Number(data.discount || 0);
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

  const billRow = "mb-4 flex items-center justify-between text-base max-md:mb-3 max-md:text-sm";

  return (
    <div className="flex flex-col rounded-[20px] border border-[#e0e0e0] p-6 text-left max-md:p-4">
      <h2 className="m-0 mb-6 text-2xl font-bold text-black max-md:mb-4 max-md:text-xl">Order Summary</h2>

      <div className={billRow}>
        <span className="text-[#666]">Subtotal</span>
        <span className="font-semibold text-black">${formatPrice(subtotal)}</span>
      </div>

      {discount > 0 && (
        <div className={billRow}>
          <span className="text-[#666]">Discount</span>
          <span className="font-semibold text-[#ff3333]">-${formatPrice(discount)}</span>
        </div>
      )}

      <div className={billRow}>
        <span className="text-[#666]">Delivery Fee</span>
        <span className="font-semibold text-black">${formatPrice(deliveryFee)}</span>
      </div>

      <div className="mt-2 mb-6 h-px bg-[#e0e0e0]"></div>

      <div className="mb-6 flex items-center justify-between text-xl font-bold text-black max-md:mb-5 max-md:text-lg">
        <span>Total</span>
        <span>${formatPrice(total)}</span>
      </div>

      <div className="mb-6 box-border flex w-full items-center rounded-3xl bg-[#f0f0f0] py-1.5 pr-1.5 pl-4 max-md:py-1 max-md:pr-1 max-md:pl-3 [&_input]:min-w-0 [&_input]:flex-1 [&_input]:border-none [&_input]:bg-transparent [&_input]:px-[5px] [&_input]:text-sm [&_input]:text-black [&_input]:uppercase [&_input]:outline-none [&_input::placeholder]:text-[#888] [&_input::placeholder]:normal-case">
        <img src={promo} alt="Promo code" />
        <input
          type="text"
          placeholder="Add promo code"
          value={promoInput}
          onChange={(e) => setPromoInput(e.target.value)}
        />
        <button
          className="shrink-0 cursor-pointer rounded-[20px] border-none bg-black px-2.5 py-1.5 md:px-3.5 font-base text-white transition-opacity hover:opacity-80 max-md:px-4"
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

      <button className="flex w-full cursor-pointer items-center justify-center rounded-3xl border-none bg-black px-4 py-2 text-base font-medium text-white transition-opacity hover:opacity-80 hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]" onClick={() => navigate(ROUTES.CHECKOUT)}>
        Go to Checkout <span className="ml-2 text-lg">→</span>
      </button>
    </div>
  );
}