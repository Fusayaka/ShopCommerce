import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    loadingText?: ReactNode;
    children: ReactNode;
}

const DEFAULT =
    'cursor-pointer rounded-md border-none bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50';

export default function SubmitButton({
    loading = false,
    loadingText,
    children,
    disabled,
    className,
    type = 'submit',
    ...rest
}: SubmitButtonProps) {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={className ?? DEFAULT}
            {...rest}
        >
            {loading && loadingText !== undefined ? loadingText : children}
        </button>
    );
}
