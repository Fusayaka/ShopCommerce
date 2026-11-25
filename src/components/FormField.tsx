import {
    useState,
    type ReactNode,
    type InputHTMLAttributes,
    type TextareaHTMLAttributes,
} from 'react';
import EyeToggle from './EyeToggle';

/** 'default' = bordered input with label above. 'filled' = bordered wrapper + borderless input + inline toggle (login glass style). */
type Variant = 'default' | 'filled';

interface CommonProps {
    label?: ReactNode;
    required?: boolean;
    error?: string;
    hint?: string;
    variant?: Variant;
    wrapperClassName?: string;
    labelClassName?: string;
    inputClassName?: string;
    errorClassName?: string;
}

type FormFieldProps =
    | ({ as?: 'input' } & CommonProps & InputHTMLAttributes<HTMLInputElement>)
    | ({ as: 'textarea' } & CommonProps & TextareaHTMLAttributes<HTMLTextAreaElement>);

const BASE_LABEL = 'ml-0.5 text-left text-sm font-medium text-slate-700';
const BASE_INPUT =
    'w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-900';

const FILLED_WRAP =
    'relative flex items-center rounded-lg border bg-white transition-colors focus-within:border-black max-md:bg-white/50';
const FILLED_INPUT =
    'w-full border-none bg-transparent px-3.5 py-[11px] text-[0.95rem] text-[#111] outline-none [&::-ms-reveal]:hidden [&::-ms-clear]:hidden';

export default function FormField(props: FormFieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    const {
        as = 'input',
        label,
        required,
        error,
        hint,
        variant = 'default',
        wrapperClassName = '',
        labelClassName = '',
        inputClassName = '',
        errorClassName = '',
        id,
        type,
        ...rest
    } = props as CommonProps & {
        as?: 'input' | 'textarea';
        id?: string;
        type?: string;
    } & Record<string, unknown>;

    const filled = variant === 'filled';
    const isPassword = as === 'input' && type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type ?? 'text';

    const inputBase = filled
        ? FILLED_INPUT
        : `${BASE_INPUT} ${error ? 'border-red-400' : 'border-slate-300'} ${isPassword ? 'pr-9' : ''}`;

    const control =
        as === 'textarea' ? (
            <textarea
                id={id}
                required={required}
                className={`${inputBase} resize-y ${inputClassName}`}
                {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
        ) : (
            <input
                id={id}
                required={required}
                type={inputType}
                className={`${inputBase} ${inputClassName}`}
                {...(rest as InputHTMLAttributes<HTMLInputElement>)}
            />
        );

    const toggle = isPassword && (
        <EyeToggle
            shown={showPassword}
            onToggle={() => setShowPassword((prev) => !prev)}
            className={filled ? 'px-3' : 'absolute right-3 top-1/2 -translate-y-1/2'}
        />
    );

    return (
        <div className={`${filled ? '' : 'flex flex-col gap-1.5'} ${wrapperClassName}`}>
            {label && (
                <label htmlFor={id} className={labelClassName || BASE_LABEL}>
                    {label}
                    {required && <span className="ml-0.5 text-red-500">*</span>}
                </label>
            )}

            {filled ? (
                <div className={`${FILLED_WRAP} ${error ? 'border-[#ff4d4f]' : 'border-[#ccc] max-md:border-white/60'}`}>
                    {control}
                    {toggle}
                </div>
            ) : (
                <div className="relative">
                    {control}
                    {toggle}
                </div>
            )}

            {error ? (
                <p
                    className={
                        filled
                            ? `mt-[3px] text-left text-[0.75rem] text-[#ff4d4f] ${errorClassName}`
                            : `ml-0.5 text-left text-xs text-red-500 ${errorClassName}`
                    }
                >
                    {error}
                </p>
            ) : (
                hint && (
                    <p className={filled ? 'mt-[3px] text-left text-[0.75rem] text-slate-400' : 'ml-0.5 text-left text-xs text-slate-400'}>
                        {hint}
                    </p>
                )
            )}
        </div>
    );
}
