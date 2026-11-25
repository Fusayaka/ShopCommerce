import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { cartApi, type CartItemResponse } from '@/api/cartApi';
import { notifyCartChanged } from '@/utils/cartCount';
import { ConfirmModal } from '@/components';
import plhImg from '/images/cloth-placeholder.jpeg';
import { formatPrice } from '@/utils/format';
import { ROUTES } from '@/constants/routes';

const QTY_STEPPER = "inline-flex items-center rounded-full bg-[#f0f0f0] px-2 py-1";
const QTY_BTN = "flex h-6 w-6 cursor-pointer items-center justify-center border-none bg-transparent text-[15px] font-semibold text-[#111827] select-none enabled:hover:text-black enabled:hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30";
const QTY_VALUE = "min-w-3 px-1 text-center text-[13px] font-semibold text-[#111827] select-none";
const IMG_BOX = "h-20 w-16 shrink-0 overflow-hidden rounded-md border border-[#e5e7eb] bg-[#f9fafb] [&_img]:block [&_img]:h-full [&_img]:w-full [&_img]:object-cover";

export interface CheckoutLineItem {
  id: number;
  stockId: number;
  productId: number;
  title: string;
  image?: string | null;
  size?: string;
  color?: string;
  unitPrice: number;
  quantity: number;
}

interface ProductListProps {
  editable?: boolean;
  onDataLoaded?: (subtotal: number, count: number) => void;
}

export default function ProductList({ editable = true, onDataLoaded }: ProductListProps) {
  const [items, setItems] = useState<CheckoutLineItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionStockId, setActionStockId] = useState<number | null>(null);

  const [removingStockId, setRemovingStockId] = useState<number | null>(null);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);

  const removingItem = useMemo(() => {
    if (removingStockId === null) return null;
    return items.find((item) => item.stockId === removingStockId) || null;
  }, [items, removingStockId]);

  const mapCartItem = useCallback((item: CartItemResponse): CheckoutLineItem => {
    const unitPrice =
      item.stock?.promotionPrice !== null && item.stock?.promotionPrice !== undefined
        ? Number(item.stock.promotionPrice)
        : Number(item.stock?.originalPrice || 0);

    return {
      id: item.id,
      stockId: item.stockId,
      productId: item.stock?.productId || item.stockId,
      title: item.stock?.product?.title || 'Unknown Product',
      image: item.stock?.product?.image,
      size: item.stock?.size,
      color: item.stock?.color,
      unitPrice,
      quantity: item.quantity,
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await cartApi.getCart();
        if (cancelled) return;
        setItems((res?.items ?? []).map(mapCartItem));
      } catch (err) {
        console.error('Failed to load cart items:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mapCartItem]);

  const { totalQuantity, sumOfSubtotal } = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.totalQuantity += item.quantity || 0;
        acc.sumOfSubtotal += (item.unitPrice || 0) * (item.quantity || 0);
        return acc;
      },
      { totalQuantity: 0, sumOfSubtotal: 0 }
    );
  }, [items]);

  useEffect(() => {
    if (onDataLoaded && !loading) {
      onDataLoaded(sumOfSubtotal, totalQuantity);
    }
  }, [sumOfSubtotal, totalQuantity, onDataLoaded, loading]);

  const handleQuantityChange = async (stockId: number, nextQty: number) => {
    if (nextQty < 0) return;
    if (nextQty === 0) {
      return handleRequestRemove(stockId);
    }
    setActionStockId(stockId);
    const prevItems = items;
    setItems((prev) =>
      prev.map((item) => (item.stockId === stockId ? { ...item, quantity: nextQty } : item))
    );
    try {
      await cartApi.updateQuantity({ stockId, quantity: nextQty });
      notifyCartChanged();
    } catch (err) {
      setItems(prevItems);
      console.error('Failed to update quantity:', err);
    } finally {
      setActionStockId(null);
    }
  };

  const handleRequestRemove = (stockId: number) => {
    setRemovingStockId(stockId);
  };

  const handleConfirmRemove = async () => {
    if (removingStockId === null) return;

    setIsRemoving(true);
    setActionStockId(removingStockId);
    const prevItems = items;
    setItems((prev) => prev.filter((item) => item.stockId !== removingStockId));

    try {
      await cartApi.removeItem(removingStockId);
      notifyCartChanged();
      setRemovingStockId(null);
    } catch (err) {
      setItems(prevItems);
      console.error('Failed to remove item:', err);
    } finally {
      setIsRemoving(false);
      setActionStockId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 py-10 text-center">
        <div className="mb-3 h-7 w-7 animate-spin rounded-full border-[3px] border-[#f3f4f6] border-t-[#111827] [animation-duration:0.8s]"></div>
        <p>Loading checkout products...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-[#e5e7eb] bg-white px-5 py-10 text-center">
        <h3 className="m-0 mb-1.5 text-base font-bold text-[#111827]">No products in checkout</h3>
        <p className="m-0 mb-4 text-[13px] text-[#6b7280]">Your shopping cart is currently empty. Please add items before checkout.</p>
        <Link to={ROUTES.PRODUCTS} className="inline-flex items-center rounded-lg bg-[#111827] px-5 py-2 text-[13px] font-semibold text-white no-underline transition-colors hover:bg-[#1f2937]">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-5 text-[#111827]">
      <div className="block w-full overflow-x-auto rounded-xl border border-[#e5e7eb] bg-white max-[645px]:hidden">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-[#111827] bg-[#f9fafb] [&_th]:px-4 [&_th]:py-3 [&_th]:text-xs [&_th]:font-bold [&_th]:tracking-[0.03em] [&_th]:text-[#374151]">
              <th className="w-[48%]">Product</th>
              <th className="w-[17%] text-center">Unit Price</th>
              <th className="w-[15%] text-center">Amount</th>
              <th className="w-[20%] text-center">Item Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const itemTotal = item.unitPrice * item.quantity;
              const isBusy = actionStockId === item.stockId;

              return (
                <tr key={`${item.id}-${item.stockId}`} className="border-b border-[#f3f4f6] transition-colors last:border-b-0 hover:bg-[#fdfdfd] [&_td]:px-4 [&_td]:py-3 [&_td]:align-middle">
                  <td>
                    <div className="flex items-center gap-3">
                      <div className={IMG_BOX}>
                        <img
                          src={item.image || plhImg}
                          alt={item.title}
                          onError={(e) => {
                            e.currentTarget.src = plhImg;
                          }}
                        />
                      </div>
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <Link to={ROUTES.PRODUCT_DETAILS(item.productId)} className="block w-full overflow-hidden text-[15px] leading-[1.25] font-semibold text-ellipsis whitespace-nowrap text-[#111827] no-underline hover:text-[#2563eb]">
                          {item.title}
                        </Link>
                        <div className="flex flex-wrap gap-1.5 text-[11.5px] text-[#6b7280]">
                          {item.size && (
                            <div className="flex gap-0.5">
                              <span className="text-[#9ca3af]">Size:</span>
                              <span className="font-semibold text-[#374151]">{item.size}</span>
                            </div>
                          )}
                          {item.color && (
                            <div className="flex gap-0.5">
                              <span className="text-[#9ca3af]">Color:</span>
                              <span className="font-semibold text-[#374151]">{item.color}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="text-center">
                    <span className="text-[13.5px] font-medium text-[#111827]">${formatPrice(item.unitPrice)}</span>
                  </td>

                  <td className="text-center">
                    {editable ? (
                      <div className={QTY_STEPPER}>
                        <button
                          type="button"
                          className={QTY_BTN}
                          disabled={isBusy}
                          onClick={() => handleQuantityChange(item.stockId, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className={QTY_VALUE}>{item.quantity}</span>
                        <button
                          type="button"
                          className={QTY_BTN}
                          disabled={isBusy}
                          onClick={() => handleQuantityChange(item.stockId, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <span className="text-[13.5px] font-semibold text-[#111827]">{item.quantity}</span>
                    )}
                  </td>

                  <td className="text-center">
                    <div className="flex items-center justify-center gap-2.5">
                      <span className="text-sm font-bold text-[#111827]">${formatPrice(itemTotal)}</span>
                      {editable && (
                        <button
                          type="button"
                          className="hidden cursor-pointer rounded border-none bg-none px-1 py-0.5 text-[13px] text-[#ef4444] transition-colors hover:bg-[#fef2f2]"
                          title="Remove item"
                          onClick={() => handleRequestRemove(item.stockId)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="hidden max-[645px]:flex max-[645px]:w-full max-[645px]:flex-col max-[645px]:gap-3">
        {items.map((item) => {
          const isBusy = actionStockId === item.stockId;

          return (
            <div key={`mobile-${item.id}-${item.stockId}`} className="box-border flex w-full gap-3 rounded-lg border border-[#111827] bg-white p-3">
              <div className={IMG_BOX}>
                <img
                  src={item.image || plhImg}
                  alt={item.title}
                  onError={(e) => {
                    e.currentTarget.src = plhImg;
                  }}
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <Link to={ROUTES.PRODUCT_DETAILS(item.productId)} className="block max-w-full overflow-hidden text-base leading-[1.25] font-semibold text-ellipsis whitespace-nowrap text-[#111827] no-underline">
                    {item.title}
                  </Link>
                  {editable && (
                    <button
                      type="button"
                      className="cursor-pointer border-none bg-none p-0 text-sm text-[#ef4444]"
                      onClick={() => handleRequestRemove(item.stockId)}
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="mt-0.5 flex gap-2 text-xs text-[#6b7280]">
                  {item.size && <span>Size: {item.size}</span>}
                  {item.color && <span>Color: {item.color}</span>}
                </div>

                <div className="mt-2.5 flex items-center justify-between">
                  <div className="text-sm font-bold text-[#111827]">${formatPrice(item.unitPrice)}</div>

                  <div>
                    {editable ? (
                      <div className={QTY_STEPPER}>
                        <button
                          type="button"
                          className={QTY_BTN}
                          disabled={isBusy}
                          onClick={() => handleQuantityChange(item.stockId, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className={QTY_VALUE}>{item.quantity}</span>
                        <button
                          type="button"
                          className={QTY_BTN}
                          disabled={isBusy}
                          onClick={() => handleQuantityChange(item.stockId, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <span className="text-[13px] text-[#374151]">
                        Quantity: <strong>{item.quantity}</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex w-full justify-end">
        <div className="box-border flex w-full max-w-[420px] flex-nowrap items-center justify-between gap-5 rounded-[10px] border border-[#111827] bg-white px-5 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] max-[645px]:max-w-full max-[645px]:flex-col max-[645px]:items-start max-[645px]:gap-1.5 max-[645px]:px-4 max-[645px]:py-2.5">
          <div className="shrink-0 text-[13.5px] font-medium whitespace-nowrap text-[#6b7280] max-[645px]:flex max-[645px]:w-full max-[645px]:items-baseline max-[645px]:justify-between">
            Total:{' '}
            <span className="ml-1 font-semibold text-[#111827] max-[645px]:text-[15px]">
              {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
            </span>
          </div>
          <div className="shrink-0 text-sm font-medium whitespace-nowrap text-[#6b7280] max-[645px]:flex max-[645px]:w-full max-[645px]:items-baseline max-[645px]:justify-between">
            Sum of subtotal:{' '}
            <span className="ml-1.5 text-[17px] font-bold tracking-tight text-[#111827] tabular-nums">
              ${formatPrice(sumOfSubtotal)}
            </span>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={removingStockId !== null}
        isLoading={isRemoving}
        title="Remove Item"
        content={
          <span>
            Are you sure you want to remove <strong>{removingItem?.title || 'this item'}</strong> from your cart?
          </span>
        }
        confirmText="Remove"
        cancelText="Cancel"
        variant="danger"
        onClose={() => setRemovingStockId(null)}
        onConfirm={handleConfirmRemove}
      />
    </div>
  );
}