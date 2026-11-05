import { useState } from 'react';
import trashIcon from '@/assets/trash-icon.svg';
import plhImg from '/images/cloth-placeholder.jpeg';
import type { CartLineItem } from '@/types';
import { Link } from 'react-router-dom';
import { ConfirmModal } from '@/components';

import './cartItemCard.css';

interface CartItemCardProps {
  item: CartLineItem;
  onUpdateQuantity: (item: CartLineItem, newQuantity: number) => void;
  onRemoveItem: (item: CartLineItem) => void;
}

export default function CartItemCard({
  item,
  onUpdateQuantity,
  onRemoveItem,
}: CartItemCardProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const increase = () => onUpdateQuantity(item, item.quantity + 1);

  const decrease = () => {
    if (item.quantity <= 1) {
      setShowConfirmModal(true);
    } else {
      onUpdateQuantity(item, item.quantity - 1);
    }
  };

  const handleConfirmDelete = () => {
    onRemoveItem(item);
    setShowConfirmModal(false);
  };

  const currentTotalPrice = item.unitPrice * item.quantity;

  return (
    <>
      <div className="cart-item">
        <Link to={`/product/${item.productId}`} className="cart-item-image">
          <img
            src={item.image}
            alt={item.title}
            onError={(e) => (e.currentTarget.src = plhImg)}
          />
        </Link>

        <div className="cart-item-info">
          <div className="cart-item-header">
            <Link to={`/product/${item.productId}`} className="cart-item-title">
              {item.title}
            </Link>
            <button
              className="cart-item-delete"
              onClick={() => setShowConfirmModal(true)}
            >
              <img src={trashIcon} alt="Delete item" />
            </button>
          </div>

          <div className="cart-item-meta">
            <p>
              Size: <span>{item.size}</span>
            </p>
            <p>
              Color: <span>{item.color}</span>
            </p>
            <p>
              Unit Price: <span>${item.unitPrice}</span>
            </p>
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

      <ConfirmModal
        isOpen={showConfirmModal}
        title="Remove Item"
        content={
          <span>
            Are you sure you want to remove <strong>{item.title}</strong> from your order?
          </span>
        }
        confirmText="Remove"
        cancelText="Cancel"
        variant="danger"
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}