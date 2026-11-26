import React from 'react';
import SubmitButton from './SubmitButton';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  content?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: 'danger' | 'primary';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  content = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  variant = 'danger',
}) => {
  if (!isOpen) return null;

  const btnBase =
    'px-[18px] py-2 text-[15px] font-medium rounded-full cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed';
  const confirmClass =
    variant === 'primary'
      ? 'bg-black text-white border-none enabled:hover:shadow-[0_0_10px_rgba(0,0,0,0.25)]'
      : 'bg-red-600 text-white border-none enabled:hover:shadow-[0_0_10px_rgba(220,38,38,0.4)]';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[400px] rounded-xl border border-gray-200 bg-white p-6 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.08)]"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
        <div className="text-sm leading-normal text-gray-500">{content}</div>

        <div className="mt-5 flex justify-end gap-2.5">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className={`${btnBase} border border-gray-300 bg-white text-gray-700 enabled:hover:shadow-[0_0_10px_rgba(0,0,0,0.12)]`}
          >
            {cancelText}
          </button>
          <SubmitButton
            type="button"
            loading={isLoading}
            loadingText="Processing..."
            onClick={onConfirm}
            className={`${btnBase} ${confirmClass}`}
          >
            {confirmText}
          </SubmitButton>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;