type StepperSize = 'sm' | 'md';

interface QuantityStepperProps {
    value: number;
    onChange: (next: number) => void;
    /** Lowest allowed value; decrementing at the minimum is blocked. Default 1. */
    min?: number;
    /** Highest allowed value; incrementing at the maximum is blocked. */
    max?: number;
    disabled?: boolean;
    size?: StepperSize;
    onDecreaseBelowMin?: () => void;
    className?: string;
}

const STYLES: Record<StepperSize, { wrapper: string; btn: string; value: string }> = {
    md: {
        wrapper: 'inline-flex items-center gap-1.5 rounded-full bg-[#f0f0f0] px-2.5 py-1.5',
        btn: 'flex h-5 w-5 cursor-pointer items-center justify-center border-none bg-transparent p-0 text-base font-semibold leading-none text-slate-600 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40',
        value: 'min-w-4 text-center text-sm font-semibold text-slate-900',
    },
    sm: {
        wrapper: 'inline-flex items-center rounded-full bg-[#f0f0f0] px-2 py-1',
        btn: 'flex h-6 w-6 cursor-pointer items-center justify-center border-none bg-transparent text-[15px] font-semibold text-[#111827] select-none enabled:hover:text-black enabled:hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30',
        value: 'min-w-3 px-1 text-center text-[13px] font-semibold text-[#111827] select-none',
    },
};

export default function QuantityStepper({
    value,
    onChange,
    min = 1,
    max,
    disabled = false,
    size = 'md',
    onDecreaseBelowMin,
    className = '',
}: QuantityStepperProps) {
    const s = STYLES[size];

    const decrease = () => {
        if (disabled) return;
        if (value <= min) {
            onDecreaseBelowMin?.();
            return;
        }
        onChange(value - 1);
    };

    const increase = () => {
        if (disabled) return;
        if (max != null && value >= max) return;
        onChange(value + 1);
    };

    const atMax = max != null && value >= max;
    const decreaseDisabled = disabled || (value <= min && !onDecreaseBelowMin);

    return (
        <div className={`${s.wrapper} ${className}`}>
            <button
                type="button"
                className={s.btn}
                onClick={decrease}
                disabled={decreaseDisabled}
                aria-label="Decrease quantity"
            >
                {'−'}
            </button>
            <span className={s.value}>{value}</span>
            <button
                type="button"
                className={s.btn}
                onClick={increase}
                disabled={disabled || atMax}
                aria-label="Increase quantity"
            >
                {'+'}
            </button>
        </div>
    );
}
