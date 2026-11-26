interface EyeToggleProps {
    shown: boolean;
    onToggle: () => void;
    className?: string;
}

export default function EyeToggle({ shown, onToggle, className = '' }: EyeToggleProps) {
    return (
        <button
            type="button"
            className={`flex cursor-pointer items-center border-none bg-transparent p-0 text-[#666] [&_svg]:h-5 [&_svg]:w-5 ${className}`}
            onClick={onToggle}
            aria-label={shown ? 'Hide password' : 'Show password'}
        >
            {shown ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" y1="2" x2="22" y2="22" /></svg>
            ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
            )}
        </button>
    );
}
