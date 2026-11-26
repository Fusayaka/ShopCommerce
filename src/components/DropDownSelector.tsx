export interface DropDownOption<T extends string | number> {
    value: T;
    label: string;
}

type Variant = 'default' | 'compact' | 'pill';

interface DropDownSelectorProps<T extends string | number> {
    value: T;
    options: DropDownOption<T>[];
    onChange: (value: T) => void;
    label?: string;
    variant?: Variant;
    disabled?: boolean;
    className?: string;
    id?: string;
    'aria-label'?: string;
}

const VARIANTS: Record<Variant, string> = {
    default:
        'h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-900 disabled:cursor-not-allowed disabled:opacity-50',
    compact:
        'cursor-pointer rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-slate-900 disabled:cursor-not-allowed disabled:opacity-50',
    pill:
        "cursor-pointer appearance-none rounded-lg border border-[#eaeaea] bg-white bg-no-repeat py-[9px] pr-9 pl-3.5 text-sm font-medium text-black transition-colors [background-position:right_12px_center] hover:border-black focus:border-black focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
};

// Chevron used by the `pill` variant (inline SVG data URI).
const PILL_CHEVRON =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")";

export default function DropDownSelector<T extends string | number>({
    value,
    options,
    onChange,
    label,
    variant = 'default',
    disabled = false,
    className = '',
    id,
    'aria-label': ariaLabel,
}: DropDownSelectorProps<T>) {
    const numeric = typeof value === 'number';

    const handleChange = (raw: string) => {
        onChange((numeric ? (Number(raw) as T) : (raw as T)));
    };

    const select = (
        <select
            id={id}
            value={String(value)}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            aria-label={ariaLabel ?? label}
            className={`${VARIANTS[variant]} ${className}`}
            style={variant === 'pill' ? { backgroundImage: PILL_CHEVRON } : undefined}
        >
            {options.map((opt) => (
                <option key={String(opt.value)} value={String(opt.value)}>
                    {opt.label}
                </option>
            ))}
        </select>
    );

    if (!label) return select;

    return (
        <label className="inline-flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">{label}</span>
            {select}
        </label>
    );
}
