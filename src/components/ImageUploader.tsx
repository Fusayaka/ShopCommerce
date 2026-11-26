import { useRef, useState, type ReactNode } from 'react';
import { toast } from 'react-toastify';

interface ImageUploaderProps {
    imageUrl?: string;
    onSelect: (file: File) => void;
    shape?: 'rounded' | 'circle';
    aspect?: string;
    uploading?: boolean;
    maxSizeMB?: number;
    appearance?: 'frame' | 'bare';
    overlay?: ReactNode;
    placeholder?: ReactNode;
    fallbackSrc?: string;
    imgClassName?: string;
    helperText?: string;
    errorText?: string;
    ariaLabel?: string;
    disabled?: boolean;
    className?: string;
}

export default function ImageUploader({
    imageUrl,
    onSelect,
    shape = 'rounded',
    aspect,
    uploading = false,
    maxSizeMB,
    appearance = 'frame',
    overlay,
    placeholder,
    fallbackSrc,
    imgClassName = '',
    helperText,
    errorText,
    ariaLabel = 'Upload image',
    disabled = false,
    className = '',
}: ImageUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [tooLarge, setTooLarge] = useState(false);

    const radius = shape === 'circle' ? 'rounded-full' : 'rounded-lg';
    const aspectCls = aspect ?? (shape === 'circle' ? 'aspect-square' : 'aspect-[3/4]');
    const frameCls =
        appearance === 'bare'
            ? 'border-none bg-transparent'
            : `border-solid bg-slate-50 ${tooLarge ? 'border-2 border-red-400' : 'border border-slate-200'}`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
            toast.error(`Image size must not exceed ${maxSizeMB}MB`);
            setTooLarge(true);
            return;
        }

        setTooLarge(false);
        onSelect(file);
    };

    const defaultOverlay = (
        <span className="text-xs font-medium text-white">
            {imageUrl ? 'Change image' : 'Upload image'}
        </span>
    );

    return (
        <div className={className}>
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={disabled || uploading}
                aria-label={ariaLabel}
                className={`group relative flex w-full cursor-pointer items-center justify-center overflow-hidden p-0 ${aspectCls} ${radius} ${frameCls}`}
            >
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="Preview"
                        onError={fallbackSrc ? (ev) => { ev.currentTarget.src = fallbackSrc; } : undefined}
                        className={`h-full w-full object-cover ${radius} ${imgClassName}`}
                    />
                ) : (
                    placeholder ?? (
                        <span className="px-2 text-center text-xs text-slate-400">No image</span>
                    )
                )}

                <span
                    className={`absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 ${radius}`}
                >
                    {overlay ?? defaultOverlay}
                </span>

                {uploading && (
                    <span className="absolute inset-0 flex items-center justify-center bg-white/70 text-xs font-medium text-slate-700">
                        Uploading…
                    </span>
                )}
            </button>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
            />

            {(helperText || errorText) && (
                <p
                    className={`mt-1 text-center text-xs ${
                        tooLarge ? 'px-2 font-medium text-rose-500' : 'text-slate-400'
                    }`}
                >
                    {tooLarge && errorText ? errorText : helperText}
                </p>
            )}
        </div>
    );
}
