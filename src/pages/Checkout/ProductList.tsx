import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { cartApi, type CartItemResponse } from '@/api/cartApi';
import { notifyCartChanged } from '@/utils/cartCount';
import plhImg from '/images/cloth-placeholder.jpeg';
import './productList.css';

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

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const res = await cartApi.getCart();
      const rawItems = res?.items || (res as any)?.data?.items || [];
      const mapped: CheckoutLineItem[] = rawItems.map((item: CartItemResponse) => {
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
      });

      setItems(mapped);
    } catch (err) {
      console.error('Failed to load cart items:', err);
    } finally {
      setLoading(false);
    }
  }, [onDataLoaded]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

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

  const formatPrice = (price: number): string => {
    return `$${price.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const handleQuantityChange = async (stockId: number, nextQty: number) => {
    if (nextQty < 1) return;
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

  const handleRemove = async (stockId: number) => {
    setActionStockId(stockId);
    const prevItems = items;
    setItems((prev) => prev.filter((item) => item.stockId !== stockId));
    try {
      await cartApi.removeItem(stockId);
      notifyCartChanged();
    } catch (err) {
      setItems(prevItems);
      console.error('Failed to remove item:', err);
    } finally {
      setActionStockId(null);
    }
  };

  if (loading) {
    return (
      <div className="checkout-product-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading checkout products...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout-product-list-empty">
        <h3>No products in checkout</h3>
        <p>Your shopping cart is currently empty. Please add items before checkout.</p>
        <Link to="/products" className="checkout-return-btn">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-product-list-container">
      <div className="checkout-table-wrapper desktop-only">
        <table className="checkout-table">
          <thead>
            <tr className="checkout-table-header-row">
              <th className="checkout-th checkout-th-product">Product</th>
              <th className="checkout-th checkout-th-price">Unit Price</th>
              <th className="checkout-th checkout-th-amount">Amount</th>
              <th className="checkout-th checkout-th-subtotal">Item Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const itemTotal = item.unitPrice * item.quantity;
              const isBusy = actionStockId === item.stockId;

              return (
                <tr key={`${item.id}-${item.stockId}`} className="checkout-table-row">
                  <td className="checkout-td checkout-td-product">
                    <div className="checkout-product-info-group">
                      <div className="checkout-product-image-box">
                        <img
                          src={item.image || plhImg}
                          alt={item.title}
                          onError={(e) => {
                            e.currentTarget.src = plhImg;
                          }}
                        />
                      </div>
                      <div className="checkout-product-meta">
                        <Link to={`/product/${item.productId}`} className="checkout-product-title">
                          {item.title}
                        </Link>
                        <div className="checkout-product-attributes">
                          {item.size && (
                            <div className="attribute-row">
                              <span className="attribute-label">Size:</span>
                              <span className="attribute-val">{item.size}</span>
                            </div>
                          )}
                          {item.color && (
                            <div className="attribute-row">
                              <span className="attribute-label">Color:</span>
                              <span className="attribute-val">{item.color}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="checkout-td checkout-td-price">
                    <span className="price-text">{formatPrice(item.unitPrice)}</span>
                  </td>

                  <td className="checkout-td checkout-td-amount">
                    {editable ? (
                      <div className="checkout-qty-stepper">
                        <button
                          type="button"
                          className="qty-btn"
                          disabled={item.quantity <= 1 || isBusy}
                          onClick={() => handleQuantityChange(item.stockId, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          type="button"
                          className="qty-btn"
                          disabled={isBusy}
                          onClick={() => handleQuantityChange(item.stockId, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <span className="amount-text">{item.quantity}</span>
                    )}
                  </td>

                  <td className="checkout-td checkout-td-subtotal">
                    <div className="subtotal-cell-content">
                      <span className="subtotal-text">{formatPrice(itemTotal)}</span>
                      {editable && (
                        <button
                          type="button"
                          className="item-delete-btn"
                          title="Remove item"
                          onClick={() => handleRemove(item.stockId)}
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

      <div className="checkout-mobile-cards mobile-only">
        {items.map((item) => {
          const isBusy = actionStockId === item.stockId;

          return (
            <div key={`mobile-${item.id}-${item.stockId}`} className="checkout-mobile-card">
              <div className="checkout-mobile-card-image">
                <img
                  src={item.image || plhImg}
                  alt={item.title}
                  onError={(e) => {
                    e.currentTarget.src = plhImg;
                  }}
                />
              </div>

              <div className="checkout-mobile-card-content">
                <div className="mobile-card-top-row">
                  <Link to={`/product/${item.productId}`} className="mobile-product-title">
                    {item.title}
                  </Link>
                  {editable && (
                    <button
                      type="button"
                      className="mobile-item-delete-btn"
                      onClick={() => handleRemove(item.stockId)}
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="mobile-product-attributes">
                  {item.size && <span>Size: {item.size}</span>}
                  {item.color && <span>Color: {item.color}</span>}
                </div>

                <div className="mobile-card-bottom-row">
                  <div className="mobile-unit-price">{formatPrice(item.unitPrice)}</div>

                  <div className="mobile-quantity-container">
                    {editable ? (
                      <div className="checkout-qty-stepper">
                        <button
                          type="button"
                          className="qty-btn"
                          disabled={item.quantity <= 1 || isBusy}
                          onClick={() => handleQuantityChange(item.stockId, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          type="button"
                          className="qty-btn"
                          disabled={isBusy}
                          onClick={() => handleQuantityChange(item.stockId, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <span className="mobile-quantity-display">
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

      <div className="checkout-subtotal-bar-wrapper">
        <div className="checkout-subtotal-bordered-box">
          <div className="order-item-count">Total: {totalQuantity} item{totalQuantity > 1 && "s"}</div>
          <div className="order-sum-subtotal">
            Sum of subtotal: <span className="highlight-price">{formatPrice(sumOfSubtotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}