import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderApi } from '@/api/orderApi';
import { promoApi } from '@/api/promoApi';
import type { PaymentMethod } from '@/types';
import { useAuth } from '@/utils/auth';
import { notifyCartChanged } from '@/utils/cartCount';
import promoIcon from '@/assets/promo-code.svg';
import { formatPrice } from '@/utils/format';
import { PAYMENT_METHODS } from '@/constants/order';
import { DELIVERY_FEE, FIELD_LIMITS } from '@/constants/commerce';
import { SubmitButton } from '@/components';
import { ROUTES } from '@/constants/routes';

interface PaymentProps {
  subtotal: number;
  itemCount: number;
}

export default function Payment({ subtotal, itemCount }: PaymentProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [address, setAddress] = useState<string>(user?.address ?? '');
  const [contact, setContact] = useState<string>(user?.contact ?? '');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('delivery');
  const [isChangingMethod, setIsChangingMethod] = useState<boolean>(false);
  const [promoInput, setPromoInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discount, setdiscount] = useState<number>(0);
  const [validatingPromo, setValidatingPromo] = useState<boolean>(false);
  const [promoMessage, setPromoMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const safeSubtotal = Number(subtotal) || 0;
  const deliveryFee = safeSubtotal > 0 ? DELIVERY_FEE : 0;
  const totalPayment = Math.max(1, safeSubtotal + deliveryFee - discount);

  const validateAndApplyPromo = useCallback(async (codeToValidate: string, currentSubtotal: number, isAutoRevalidate = true) => {
    if (!codeToValidate) return;

    setValidatingPromo(true);
    if (!isAutoRevalidate) setPromoMessage(null);

    try {
      const data = await promoApi.validateCode(codeToValidate, currentSubtotal);

      if (data.isValid) {
        const discountVal = Number(data.discount || 0);
        setdiscount(discountVal);
        setAppliedPromo(codeToValidate);
        setPromoMessage({
          text: `Applied successfully! Saved $${formatPrice(discountVal)}`,
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
      setPromoMessage({
        text: typeof msg === 'string' ? msg : 'Error validating code',
        type: 'error',
      });
    } finally {
      setValidatingPromo(false);
    }
  }, []);

  useEffect(() => {
    if (!appliedPromo) return;

    const timer = setTimeout(() => {
      validateAndApplyPromo(appliedPromo, safeSubtotal, true);
    }, 500);

    return () => clearTimeout(timer);
  }, [safeSubtotal, appliedPromo, validateAndApplyPromo]);

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

    await validateAndApplyPromo(code, safeSubtotal, false);
  };

  const handlePlaceOrder = async () => {
    if (itemCount === 0 || safeSubtotal === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    const trimmedAddress = address.trim();
    const trimmedContact = contact.trim();

    if (!trimmedAddress) {
      toast.error('Please enter a delivery address.');
      return;
    }

    if (!trimmedContact) {
      toast.error('Please enter a contact number.');
      return;
    }

    setSubmitting(true);
    try {
      await orderApi.createOrder({
        paymentMethod: selectedMethod,
        deliveryFee,
        promoCode: appliedPromo || undefined,
        address: trimmedAddress,
        contact: trimmedContact,
      });

      notifyCartChanged();
      toast.success('Order placed successfully!');
      navigate(ROUTES.ORDERS);
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

  const summaryRow = "flex items-center justify-between text-sm";
  const summaryLabel = "font-medium text-[#4b5563]";
  const summaryVal = "font-semibold text-[#111827]";

  return (
    <div className="mt-4 box-border w-full">
      <div className="mb-5 box-border rounded-xl border border-[#e5e7eb] bg-white px-5 py-4 max-md:px-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <p className="m-0 mb-3.5 text-[15px] font-bold text-[#111827]">Delivery Details</p>

        <div className="mb-3 text-left flex flex-col gap-1.5 [&_input]:box-border [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-[#e5e7eb] [&_input]:bg-[#f9fafb] [&_input]:px-3.5 [&_input]:py-2.5 [&_input]:text-sm [&_input]:text-[#111827] [&_input]:outline-none [&_input]:transition-colors [&_input:focus]:border-[#111827] [&_input:focus]:bg-white [&_label]:pl-4 [&_label]:max-md:pl-3 [&_label]:text-[12.5px] [&_label]:font-semibold [&_label]:tracking-[0.02em] [&_label]:text-[#4b5563] [&_label]:uppercase">
          <label htmlFor="shipping-address">Address</label>
          <input
            id="shipping-address"
            type="text"
            placeholder="Enter delivery address"
            value={address}
            maxLength={FIELD_LIMITS.address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="mb-3 text-left flex flex-col gap-1.5 [&_input]:box-border [&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-[#e5e7eb] [&_input]:bg-[#f9fafb] [&_input]:px-3.5 [&_input]:py-2.5 [&_input]:text-sm [&_input]:text-[#111827] [&_input]:outline-none [&_input]:transition-colors [&_input:focus]:border-[#111827] [&_input:focus]:bg-white [&_label]:pl-4 [&_label]:max-md:pl-3 [&_label]:text-[12.5px] [&_label]:font-semibold [&_label]:tracking-[0.02em] [&_label]:text-[#4b5563] [&_label]:uppercase">
          <label htmlFor="shipping-contact">Contact</label>
          <input
            id="shipping-contact"
            type="text"
            placeholder="Enter contact number"
            value={contact}
            maxLength={FIELD_LIMITS.contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>

        <p className="mt-0.5 mb-0 text-xs text-[#6b7280]">
          Prefilled from your profile — edit if this order ships elsewhere.
        </p>
      </div>

      <div className="mb-5 box-border flex items-center justify-between gap-4 rounded-xl border border-[#111827] bg-white px-5 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] max-[645px]:flex-col max-[645px]:items-start max-[645px]:gap-2.5 max-[645px]:px-4 max-[645px]:py-3.5">
        <div className="shrink-0">
          <span className="text-[15px] font-bold text-[#111827]">Payment Method</span>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-center gap-2 max-[645px]:justify-start">
          <span className="text-[14.5px] font-semibold text-[#111827]">{activeMethodObj.label}</span>
        </div>

        <div className="shrink-0 max-[645px]:self-end">
          <button
            type="button"
            className="w-[60px] cursor-pointer border-none bg-none px-2 py-1 text-[13.5px] font-semibold text-[#2563eb] transition-colors hover:text-[#1d4ed8] hover:underline"
            onClick={() => setIsChangingMethod((prev) => !prev)}
          >
            {isChangingMethod ? 'Done' : 'Change'}
          </button>
        </div>
      </div>

      {isChangingMethod && (
        <div className="mb-5 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4">
          <p className="m-0 mb-3 text-[13.5px] font-bold tracking-[0.02em] text-[#374151] uppercase">Select Payment Option:</p>
          <div className="flex flex-col gap-2.5">
            {PAYMENT_METHODS.map((method) => (
              <label
                key={method.id}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-all [&_input]:h-4 [&_input]:w-4 [&_input]:cursor-pointer [&_input]:accent-[#111827] ${
                  selectedMethod === method.id
                    ? 'border-[#111827] bg-white shadow-[0_0_0_1px_#111827]'
                    : 'border-[#e5e7eb] bg-white hover:border-[#d1d5db] hover:bg-[#fafafa]'
                }`}
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
                <div>
                  <div className="text-left text-sm font-semibold text-[#111827]">{method.label}</div>
                  <div className="mt-0.5 text-left text-[12.5px] text-[#6b7280] max-[645px]:text-left max-[645px]:text-xs">{method.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-col items-end max-[645px]:items-center">
        <div className="box-border flex w-full h-11 max-w-[360px] items-center gap-2.5 rounded-full border border-[#e5e7eb] bg-[#f3f4f6] py-1.5 pr-1.5 pl-4 transition-colors focus-within:border-[#111827] focus-within:bg-white max-[645px]:max-w-full [&_input]:min-w-0 [&_input]:flex-1 [&_input]:border-none [&_input]:bg-transparent [&_input]:text-[13.5px] [&_input]:text-[#111827] [&_input]:uppercase [&_input]:outline-none [&_input::placeholder]:normal-case">
          <img src={promoIcon} alt="Promo" className="h-[18px] w-[18px] opacity-50" />
          <input
            type="text"
            placeholder="Add promo code"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
          />
          <SubmitButton
            type="button"
            className="cursor-pointer rounded-full border-none bg-[#111827] px-3.5 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#1f2937]"
            loading={validatingPromo}
            loadingText="Checking..."
            onClick={handleApplyPromo}
          >
            Apply
          </SubmitButton>
        </div>
        {promoMessage && (
          <p className={`mt-1.5 mb-0 w-full max-w-[360px] text-right text-[12.5px] font-medium max-[645px]:max-w-fit ${promoMessage.type === 'success' ? 'text-[#16a34a]' : 'text-[#dc2626]'}`}>{promoMessage.text}</p>
        )}
      </div>

      <div className="mt-2.5 mb-8 flex justify-end">
        <div className="flex w-full max-w-[360px] flex-col gap-2.5 max-[645px]:max-w-full">
          <div className={summaryRow}>
            <span className={summaryLabel}>Subtotal</span>
            <span className={summaryVal}>${formatPrice(safeSubtotal)}</span>
          </div>

          <div className={summaryRow}>
            <span className={summaryLabel}>Shipping</span>
            <span className={summaryVal}>${formatPrice(deliveryFee)}</span>
          </div>

          {discount > 0 && (
            <div className={summaryRow}>
              <span className="font-medium text-[#dc2626]">Discount</span>
              <span className="font-semibold text-[#dc2626]">-${formatPrice(discount)}</span>
            </div>
          )}

          <div className="my-2 h-0 w-full border-t-2 border-[#111827]"></div>

          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-base font-semibold text-[#111827]">Total payment</span>
            <span className="text-xl font-bold text-[#111827] tabular-nums">
              ${formatPrice(totalPayment)}
            </span>
          </div>

          <div className="mt-2 flex justify-end">
            <SubmitButton
              type="button"
              className="w-full cursor-pointer rounded-full border-none bg-[#111827] px-5 py-3 text-[15px] font-bold tracking-[0.3px] text-white shadow-[0_2px_6px_rgba(0,0,0,0.08)] transition-[background-color,transform] enabled:hover:bg-[#1f2937] enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              loading={submitting}
              loadingText="Placing Order..."
              disabled={itemCount === 0}
              onClick={handlePlaceOrder}
            >
              Place order
            </SubmitButton>
          </div>
        </div>
      </div>
    </div>
  );
}