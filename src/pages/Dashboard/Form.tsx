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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file
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
            className="group relative flex aspect-[3/4] w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-0"
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
          <p className="mt-1 text-center text-xs text-slate-400">Click to upload (max 5MB)</p>
        </div>

        {/* Right: fields */}
        <div className="flex flex-1 flex-col gap-3">
          <div>
            <label className="mb-1 block pl-2 text-left text-sm font-medium text-slate-700">Title</label>
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
