import React from 'react';
import './modal.css';

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

  return (
    <div className="confirm-modal-overlay" onClick={onClose}>
      <div className="confirm-modal-card" onClick={e => e.stopPropagation()}>
        <h3 className="confirm-modal-title">{title}</h3>
        <div className="confirm-modal-content">{content}</div>

        <div className="confirm-modal-actions">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="confirm-modal-btn confirm-modal-btn-cancel"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`confirm-modal-btn ${
              variant === 'primary' ? 'confirm-modal-btn-primary' : 'confirm-modal-btn-danger'
            }`}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;