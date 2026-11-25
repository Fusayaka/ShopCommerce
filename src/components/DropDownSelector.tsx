export interface DropDownOption<T extends string | number> {
    value: T;
    label: string;
}

interface DropDownSelectorProps<T extends string | number> {
    value: T;
    options: DropDownOption<T>[];
    onChange: (value: T) => void;
    label?: string;
    disabled?: boolean;
    className?: string;
    'aria-label'?: string;
}

const BASE =
    'h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-900 disabled:cursor-not-allowed disabled:opacity-50';

export default function DropDownSelector<T extends string | number>({
    value,
    options,
    onChange,
    label,
    disabled = false,
    className = '',
    'aria-label': ariaLabel,
}: DropDownSelectorProps<T>) {
    const numeric = typeof value === 'number';

    const handleChange = (raw: string) => {
        onChange((numeric ? (Number(raw) as T) : (raw as T)));
    };

    const select = (
        <select
            value={String(value)}
            onChange={(e) => handleChange(e.target.value)}
            disabled={disabled}
            aria-label={ariaLabel ?? label}
            className={`${BASE} ${className}`}
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
