import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { productApi, type UpdateStockDto } from '@/api/productApi';
import type { ProductStock, Size, Color } from '@/types';
import { ConfirmModal } from '@/components';

const SIZES: Size[] = ['S', 'M', 'L', 'XL', 'XXL'];
const COLORS: Color[] = ['Red', 'Green', 'Blue'];

interface StockEditorProps {
    productId: number;
    productTitle: string;
    onClose: () => void;
    onSaved?: () => void;
}

interface Row {
    id: number;
    size: Size;
    color: Color;
    stock: number;
    originalPrice: number;
    promotionPrice: number | '';
}

interface NewVariant {
    size: Size;
    color: Color;
    stock: number;
    originalPrice: number;
    promotionPrice: number | '';
}

const toRow = (s: ProductStock): Row => ({
    id: s.id,
    size: s.size,
    color: s.color,
    stock: s.stock ?? 0,
    originalPrice: Number(s.originalPrice ?? 0),
    promotionPrice: s.promotionPrice === null || s.promotionPrice === undefined ? '' : Number(s.promotionPrice),
});

const EMPTY_VARIANT: NewVariant = { size: 'M', color: 'Blue', stock: 0, originalPrice: 0, promotionPrice: '' };

const cellInput =
    'w-24 rounded border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900';
const cellInputError =
    'w-24 rounded border border-red-400 bg-red-50 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-red-500';

interface VariantInput {
    stock: number;
    originalPrice: number;
    promotionPrice: number | '';
}

interface VariantErrors {
    stock?: string;
    originalPrice?: string;
    promotionPrice?: string;
}

const validateVariant = (v: VariantInput): VariantErrors => {
    const errors: VariantErrors = {};

    if (!Number.isFinite(v.stock) || !Number.isInteger(v.stock) || v.stock < 0) {
        errors.stock = 'Stock must be a whole number ≥ 0';
    }

    if (!Number.isFinite(v.originalPrice) || v.originalPrice <= 0) {
        errors.originalPrice = 'Original price must be greater than 0';
    }

    if (v.promotionPrice !== '') {
        const promo = Number(v.promotionPrice);
        if (!Number.isFinite(promo) || promo <= 0) {
            errors.promotionPrice = 'Promo price must be greater than 0';
        } else if (Number.isFinite(v.originalPrice) && promo > v.originalPrice) {
            errors.promotionPrice = 'Promo price cannot exceed original price';
        }
    }

    return errors;
};

const hasErrors = (e: VariantErrors): boolean => Object.keys(e).length > 0;

export default function StockEditor({ productId, productTitle, onClose, onSaved }: StockEditorProps) {
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [savingId, setSavingId] = useState<number | null>(null);
    const [reloadToken, setReloadToken] = useState<number>(0);
    const [newVariant, setNewVariant] = useState<NewVariant>(EMPTY_VARIANT);
    const [adding, setAdding] = useState<boolean>(false);
    const [addAttempted, setAddAttempted] = useState<boolean>(false);
    const [attemptedRowIds, setAttemptedRowIds] = useState<Set<number>>(new Set());
    const [pendingDelete, setPendingDelete] = useState<Row | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const product = await productApi.getProduct(productId);
                if (cancelled) return;
                setRows((product.stocks ?? []).map(toRow));
                setError(null);
            } catch (err) {
                console.error('Failed to load stock:', err);
                if (!cancelled) setError('Failed to load stock. Please try again.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [productId, reloadToken]);

    const setField = (id: number, field: 'stock' | 'originalPrice' | 'promotionPrice', value: number | '') => {
        setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
    };

    const saveRow = async (row: Row) => {
        const errors = validateVariant(row);
        if (hasErrors(errors)) {
            setAttemptedRowIds((prev) => new Set(prev).add(row.id));
            toast.error(errors.stock ?? errors.originalPrice ?? errors.promotionPrice);
            return;
        }
        setAttemptedRowIds((prev) => {
            if (!prev.has(row.id)) return prev;
            const next = new Set(prev);
            next.delete(row.id);
            return next;
        });
        setSavingId(row.id);
        try {
            const dto: UpdateStockDto = {
                stock: row.stock,
                originalPrice: row.originalPrice,
                promotionPrice: row.promotionPrice === '' ? null : Number(row.promotionPrice),
            };
            await productApi.updateStock(productId, row.id, dto);
            toast.success(`${row.size} / ${row.color} updated`);
            onSaved?.();
        } catch (err) {
            console.error('Failed to update variant:', err);
        } finally {
            setSavingId(null);
        }
    };

    const addVariant = async () => {
        const errors = validateVariant(newVariant);
        if (hasErrors(errors)) {
            setAddAttempted(true);
            toast.error(errors.stock ?? errors.originalPrice ?? errors.promotionPrice);
            return;
        }
        setAddAttempted(false);
        setAdding(true);
        try {
            await productApi.updateProductStock(productId, {
                size: newVariant.size,
                color: newVariant.color,
                stock: newVariant.stock,
                originalPrice: newVariant.originalPrice,
                promotionPrice: newVariant.promotionPrice === '' ? undefined : Number(newVariant.promotionPrice),
            });
            toast.success('Variant saved');
            setNewVariant(EMPTY_VARIANT);
            setReloadToken((t) => t + 1);
            onSaved?.();
        } catch (err) {
            console.error('Failed to add variant:', err);
        } finally {
            setAdding(false);
        }
    };

    const confirmDelete = async () => {
        if (!pendingDelete) return;
        const row = pendingDelete;
        setDeletingId(row.id);
        try {
            await productApi.deleteVariant(productId, row.id);
            setRows((prev) => prev.filter((r) => r.id !== row.id));
            setPendingDelete(null);
            toast.success(`${row.size} / ${row.color} removed`);
            onSaved?.();
        } catch (err) {
            console.error('Failed to delete variant:', err);
        } finally {
            setDeletingId(null);
        }
    };

    const newVariantErrors: VariantErrors = addAttempted ? validateVariant(newVariant) : {};

    return (
        <>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
            <div
                className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Stock & pricing</h2>
                        <p className="truncate text-sm text-slate-500">{productTitle}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-md border-none bg-transparent px-2 text-xl text-slate-400 hover:text-slate-700"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {error ? (
                        <p className="py-6 text-center text-sm text-red-600">{error}</p>
                    ) : loading ? (
                        <p className="py-6 text-center text-sm text-slate-400">Loading…</p>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                                    <th className="py-2 font-semibold">Size</th>
                                    <th className="py-2 font-semibold">Color</th>
                                    <th className="py-2 font-semibold pl-2">Stock</th>
                                    <th className="py-2 font-semibold pl-2">Original Price</th>
                                    <th className="py-2 font-semibold pl-2">Promo Price</th>
                                    <th className="py-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-6 text-center text-slate-400">
                                            No variants yet. Add one below.
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((row) => {
                                        const errs: VariantErrors = attemptedRowIds.has(row.id)
                                            ? validateVariant(row)
                                            : {};
                                        return (
                                        <tr key={row.id} className="border-b border-slate-100 align-center">
                                            <td className="py-2 font-medium text-slate-800 pl-1">{row.size}</td>
                                            <td className="py-2 text-slate-700 pl-1">{row.color}</td>
                                            <td className="py-2">
                                                <input
                                                    type="number"
                                                    min={0}
                                                    step="1"
                                                    value={row.stock}
                                                    aria-invalid={Boolean(errs.stock)}
                                                    onChange={(e) => setField(row.id, 'stock', Number(e.target.value))}
                                                    className={errs.stock ? cellInputError : cellInput}
                                                />
                                                {errs.stock && (
                                                    <p className="mt-1 w-24 text-xs text-red-600">{errs.stock}</p>
                                                )}
                                            </td>
                                            <td className="py-2">
                                                <input
                                                    type="number"
                                                    min={0}
                                                    step="1"
                                                    value={row.originalPrice}
                                                    aria-invalid={Boolean(errs.originalPrice)}
                                                    onChange={(e) => setField(row.id, 'originalPrice', Number(e.target.value))}
                                                    className={errs.originalPrice ? cellInputError : cellInput}
                                                />
                                                {errs.originalPrice && (
                                                    <p className="mt-1 w-24 text-xs text-red-600">{errs.originalPrice}</p>
                                                )}
                                            </td>
                                            <td className="py-2">
                                                <input
                                                    type="number"
                                                    min={0}
                                                    step="1"
                                                    value={row.promotionPrice}
                                                    placeholder="—"
                                                    aria-invalid={Boolean(errs.promotionPrice)}
                                                    onChange={(e) =>
                                                        setField(
                                                            row.id,
                                                            'promotionPrice',
                                                            e.target.value === '' ? '' : Number(e.target.value),
                                                        )
                                                    }
                                                    className={errs.promotionPrice ? cellInputError : cellInput}
                                                />
                                                {errs.promotionPrice && (
                                                    <p className="mt-1 w-24 text-xs text-red-600">{errs.promotionPrice}</p>
                                                )}
                                            </td>
                                            <td className="py-2 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => saveRow(row)}
                                                        disabled={savingId === row.id || deletingId === row.id}
                                                        className="cursor-pointer rounded-md border-none bg-slate-900 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {savingId === row.id ? 'Saving…' : 'Save'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setPendingDelete(row)}
                                                        disabled={savingId === row.id || deletingId === row.id}
                                                        className="cursor-pointer rounded-md border border-red-200 bg-white px-3 py-1 text-xs font-normal text-red-600 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Add variant */}
                <div className="flex flex-col border-t border-slate-200 bg-slate-50 px-6 py-4 gap-2 mb-2">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Add variant</p>
                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            value={newVariant.size}
                            onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value as Size })}
                            className="rounded border border-slate-300 px-2 py-1 text-sm"
                        >
                            {SIZES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        <select
                            value={newVariant.color}
                            onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value as Color })}
                            className="rounded border border-slate-300 px-2 py-1 text-sm"
                        >
                            {COLORS.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            min={0}
                            step="1"
                            placeholder="Stock"
                            value={newVariant.stock}
                            aria-invalid={Boolean(newVariantErrors.stock)}
                            onChange={(e) => setNewVariant({ ...newVariant, stock: Number(e.target.value) })}
                            className={`w-20 rounded border px-2 py-1 text-sm ${
                                newVariantErrors.stock ? 'border-red-400 bg-red-50' : 'border-slate-300'
                            }`}
                        />
                        <input
                            type="number"
                            min={0}
                            step="0.01"
                            placeholder="Original"
                            value={newVariant.originalPrice}
                            aria-invalid={Boolean(newVariantErrors.originalPrice)}
                            onChange={(e) => setNewVariant({ ...newVariant, originalPrice: Number(e.target.value) })}
                            className={`w-30 rounded border px-2 py-1 text-sm ${
                                newVariantErrors.originalPrice ? 'border-red-400 bg-red-50' : 'border-slate-300'
                            }`}
                        />
                        <input
                            type="number"
                            min={0}
                            step="0.01"
                            placeholder="Promo Price"
                            value={newVariant.promotionPrice}
                            aria-invalid={Boolean(newVariantErrors.promotionPrice)}
                            onChange={(e) =>
                                setNewVariant({
                                    ...newVariant,
                                    promotionPrice: e.target.value === '' ? '' : Number(e.target.value),
                                })
                            }
                            className={`w-30 rounded border px-2 py-1 text-sm ${
                                newVariantErrors.promotionPrice ? 'border-red-400 bg-red-50' : 'border-slate-300'
                            }`}
                        />
                        <button
                            type="button"
                            onClick={addVariant}
                            disabled={adding}
                            className="cursor-pointer rounded-md border-none bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {adding ? 'Adding…' : 'Add'}
                        </button>
                    </div>
                    {hasErrors(newVariantErrors) && (
                        <ul className="mt-1 space-y-0.5 text-xs text-red-600">
                            {newVariantErrors.stock && <li>{newVariantErrors.stock}</li>}
                            {newVariantErrors.originalPrice && <li>{newVariantErrors.originalPrice}</li>}
                            {newVariantErrors.promotionPrice && <li>{newVariantErrors.promotionPrice}</li>}
                        </ul>
                    )}
                    <p className="mt-2 text-xs text-slate-400">
                        Adding an existing size/color combination updates its price or stock instead.
                    </p>
                </div>
            </div>
        </div>

        {pendingDelete && (
            <ConfirmModal
                isOpen
                onClose={() => setPendingDelete(null)}
                onConfirm={confirmDelete}
                title ={"Delete Variant?"}
                content = {`This will permanently remove ${pendingDelete.size} / ${pendingDelete.color} from this product. This action cannot be undone.`}
                confirmText = "Confirm"
                cancelText = "Cancel"
                isLoading = {false}
                variant = 'danger'
            />
        )}
        </>
    );
}
