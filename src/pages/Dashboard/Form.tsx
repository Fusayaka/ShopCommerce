import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { productApi } from '@/api/productApi';
import plhImg from '/images/cloth-placeholder.jpeg';

export interface ProductFormData {
  title: string;
  description: string;
  image: string;
}

interface ProductFormProps {
  initialValues?: ProductFormData;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
  isSubmitting?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const ProductForm: React.FC<ProductFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isEditing = false,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<ProductFormData>(
    () => initialValues ?? { title: '', description: '', image: '' }
  );
  const [uploading, setUploading] = useState(false);
  const [exceedFileSize, setExceedFileSize] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE){
      toast.error('Image size must not exceed 5MB');
      e.target.value = '';
      setExceedFileSize(true);
      return;
    }

    setExceedFileSize(false);
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    setUploading(true);
    try {
      const { url } = await productApi.uploadImage(file);
      setFormData((prev) => ({ ...prev, image: url }));
    } catch (err) {
      // axiosClient already surfaces an error toast.
      console.error('Image upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      image: formData.image.trim(),
    });
  };

  const inputClass =
    'w-full rounded-md border border-slate-300 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <h2 className="text-xl font-bold text-slate-900">
        {isEditing ? 'Edit product' : 'New product'}
      </h2>

      <div className="flex flex-col gap-5 sm:flex-row">
        {/* Left: image upload + preview */}
        <div className="shrink-0 sm:w-48">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={`
              group relative flex aspect-[3/4] w-full cursor-pointer 
              items-center justify-center overflow-hidden rounded-lg 
              ${exceedFileSize ? 'border-2.5 border-red-400' :'border border-slate-200'} border-solid bg-slate-50 p-0
            `}
          >
            {formData.image ? (
              <img
                src={formData.image}
                alt="Preview"
                onError={(e) => {
                  e.currentTarget.src = plhImg;
                }}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="px-2 text-center text-xs text-slate-400">No image</span>
            )}

            <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
              {formData.image ? 'Change image' : 'Upload image'}
            </span>

            {uploading && (
              <span className="absolute inset-0 flex items-center justify-center bg-white/70 text-xs font-medium text-slate-700">
                Uploading…
              </span>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <p
            className={`mt-1 text-center text-xs ${
                exceedFileSize ? 'font-medium text-rose-500 px-2' : 'text-slate-400'
            }`}
          >
            {exceedFileSize
                ? 'File is too large. Maximum size is 5MB.'
                : 'Click to upload (max 5MB)'}
          </p>
          
        </div>

        {/* Right: fields */}
        <div className="flex flex-1 flex-col gap-3">
          <div>
            <label className="mb-1 block pl-2 text-left text-sm font-medium text-slate-700">Title <span className='text-red-500'>*</span></label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={inputClass}
              placeholder="Product name"
              required
            />
          </div>

          <div>
            <label className="mb-1 block pl-2 text-left font-medium text-slate-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className={`${inputClass}`}
              placeholder="Short description"
            />
          </div>

        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="cursor-pointer rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer rounded-md border-none bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving…' : isEditing ? 'Save changes' : 'Create product'}
        </button>
      </div>
    </form>
  );
};

export interface RedeliveryFormData {
  reason: string;
  note: string;
  address: string;
  contact: string;
}

interface RedeliveryFormProps {
  orderId: number;
  onSubmit: (data: RedeliveryFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  currentAddress?: string;
  currentContact?: string;
}

export const RedeliveryForm: React.FC<RedeliveryFormProps> = ({
  orderId,
  onSubmit,
  onCancel,
  isSubmitting = false,
  currentAddress,
  currentContact,
}) => {
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [attempted, setAttempted] = useState(false);

  const reasonMissing = !reason.trim();

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (reasonMissing) {
      setAttempted(true);
      toast.error('Reason is required');
      return;
    }
    onSubmit({
      reason: reason.trim(),
      note: note.trim(),
      address: address.trim(),
      contact: contact.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-base font-bold text-slate-900">Redeliver for Order #{orderId}</h3>
      <p className="mt-1 text-sm text-slate-500">Create a redelivery for this cancelled order.</p>

      <label className="mt-4 text-left pl-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        Reason <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="e.g. Customer requested re-delivery"
        className={`mt-1 w-full rounded border px-3 py-2 text-sm outline-none ${
          attempted && reasonMissing
            ? 'border-red-400 bg-red-50'
            : 'border-slate-300 focus:border-slate-900'
        }`}
      />
      {attempted && reasonMissing && (
        <p className="mt-1 text-xs text-red-600">Reason is required</p>
      )}

      <label className="mt-4 text-left pl-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        Note
      </label>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional note"
        rows={3}
        className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
      />

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-left pl-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            New address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={currentAddress || 'Keep current address'}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
        </div>
        <div>
          <label className="block text-left pl-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            New contact
          </label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder={currentContact || 'Keep current contact'}
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
        </div>
      </div>
      <p className="mt-1 text-xs text-slate-400">
        Fill these only if the customer requested a different location or phone number.
      </p>

      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="cursor-pointer rounded-md border border-slate-300 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer rounded-md border-none bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Creating…' : 'Create redelivery'}
        </button>
      </div>
    </form>
  );
};
