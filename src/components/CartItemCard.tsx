import { useState } from 'react';
import trashIcon from '@/assets/trash-icon.svg';
import plhImg from '/images/cloth-placeholder.jpeg';
import type { CartLineItem } from '@/types';
import { Link } from 'react-router-dom';
import { ConfirmModal, QuantityStepper } from '@/components';

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

  const handleConfirmDelete = () => {
    onRemoveItem(item);
    setShowConfirmModal(false);
  };

  const currentTotalPrice = item.unitPrice * item.quantity;

  return (
    <>
      <div className="flex gap-4 border-b border-[#e0e0e0] py-6 first:pt-0 last:border-b-0 last:pb-0">
        <Link
          to={`/product/${item.productId}`}
          className="block h-[130px] w-[120px] shrink-0 overflow-hidden rounded-[8.6px] bg-[#f2f2f2] max-md:h-[90px] max-md:w-[75px]"
        >
          <img
            src={item.image}
            alt={item.title}
            onError={(e) => (e.currentTarget.src = plhImg)}
            className="h-full w-full object-cover"
          />
        </Link>

        <div className="flex flex-1 flex-col text-left max-md:min-w-0">
          <div className="flex items-start justify-between">
            <Link
              to={`/product/${item.productId}`}
              className="m-0 block overflow-hidden text-xl font-bold text-ellipsis whitespace-nowrap text-black no-underline hover:text-[#d31b1b] max-md:text-base"
            >
              {item.title}
            </Link>
            <button
              className="flex cursor-pointer items-center justify-center border-none bg-none p-0 hover:opacity-70"
              onClick={() => setShowConfirmModal(true)}
            >
              <img src={trashIcon} alt="Delete item" className="h-6 w-6 object-contain" />
            </button>
          </div>

          <div className="mt-1.5 [&_p]:my-0.5 [&_p]:text-sm [&_p]:leading-[1.4] [&_p]:text-[#6b7280] [&_span]:font-semibold [&_span]:text-[#374151]">
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

          <div className="mt-auto flex items-center justify-between pt-3 max-md:mt-3">
            <p className="m-0 flex items-center whitespace-nowrap pr-2.5 text-base font-medium text-black max-md:text-[13px]">
              Total Price <span className="ml-1.5 text-xl font-bold text-[#ff3333] max-md:text-base">${currentTotalPrice}</span>
            </p>

            <QuantityStepper
              value={item.quantity}
              onChange={(q) => onUpdateQuantity(item, q)}
              onDecreaseBelowMin={() => setShowConfirmModal(true)}
              className="shrink-0 max-md:w-auto"
            />
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