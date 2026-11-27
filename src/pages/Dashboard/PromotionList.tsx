import { useEffect, useState } from 'react';
import { promoApi, type PromoPayload } from '@/api/promoApi';
import type { PromoCode } from '@/types';
import { ConfirmModal, Pagination, DropDownSelector, FormField, SubmitButton } from '@/components';
import { formatPrice, formatDate } from '@/utils/format';
import { CONFIG } from '@/config';
import { toast } from 'react-toastify';

type PromoType = 'percent' | 'fixed';
type TypeFilter = 'all' | PromoType;
const NEW_ROW = '__new__';
const LIMIT = CONFIG.DEFAULT_PAGE_SIZE;

interface Draft {
    code: string;
    type: PromoType;
    value: string;        // discountPer (%) or discountNum ($)
    maxDiscount: string;  // percent only
    minToApply: string;
    expiredAt: string;
}

const emptyDraft = (): Draft => ({ code: '', type: 'fixed', value: '', maxDiscount: '', minToApply: '', expiredAt: '' });

const promoType = (p: PromoCode): PromoType => (p.discountPer != null ? 'percent' : 'fixed');

const isExpired = (expiredAt: string): boolean => {
    const exp = new Date(expiredAt); exp.setHours(0, 0, 0, 0);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return exp < today;
};

const fromPromo = (p: PromoCode): Draft => ({
    code: p.code,
    type: promoType(p),
    value: String(promoType(p) === 'percent' ? p.discountPer ?? '' : p.discountNum ?? ''),
    maxDiscount: p.maxDiscountNum != null ? String(p.maxDiscountNum) : '',
    minToApply: p.minToApply != null ? String(p.minToApply) : '',
    expiredAt: p.expiredAt ? String(p.expiredAt).slice(0, 10) : '',
});

const toNum = (s: string): number | null => {
    const t = s.trim();
    if (t === '') return null;
    const n = Number(t);
    return Number.isFinite(n) ? n : null;
};

export default function PromotionList() {
    const [promos, setPromos] = useState<PromoCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reloadToken, setReloadToken] = useState(0);

    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
    const [expDir, setExpDir] = useState<'asc' | 'desc'>('asc');
    const [page, setPage] = useState(1);

    const [editingCode, setEditingCode] = useState<string | null>(null);
    const [draft, setDraft] = useState<Draft>(emptyDraft());
    const [saving, setSaving] = useState(false);

    const [deleteCode, setDeleteCode] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const data = await promoApi.list();
                if (cancelled) return;
                setPromos(Array.isArray(data) ? data : []);
                setError(null);
            } catch (err) {
                console.error('Failed to load promotions:', err);
                if (!cancelled) setError('Failed to load promotions. Please try again.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [reloadToken]);

    const filtered = promos.filter((p) => {
        if (search.trim() && !p.code.toLowerCase().includes(search.trim().toLowerCase())) return false;
        if (typeFilter !== 'all' && promoType(p) !== typeFilter) return false;
        return true;
    });
    // Status rank for the default Expires sort: active (0) > no-expiry (1) > expired (2).
    const expiryRank = (p: PromoCode) => (!p.expiredAt ? 1 : isExpired(p.expiredAt) ? 2 : 0);
    const byExpiry = (a: PromoCode, b: PromoCode) => {
        const r = expiryRank(a) - expiryRank(b);
        const dir = expDir === 'asc' ? 1 : -1;
        if (r !== 0) return r;
        const da = a.expiredAt ? new Date(a.expiredAt).getTime() : 0;
        const db = b.expiredAt ? new Date(b.expiredAt).getTime() : 0;
        // same group: soonest expiry first, name second
        if (da !== db) return (da - db) * dir;
        return a.code.localeCompare(b.code);
    };
    const sorted = [...filtered].sort((a, b) => (expDir === 'asc' ? byExpiry(a, b) : -byExpiry(a, b)));

    const lastPage = Math.max(1, Math.ceil(sorted.length / LIMIT));
    const safePage = Math.min(page, lastPage);
    const pageRows = sorted.slice((safePage - 1) * LIMIT, safePage * LIMIT);

    const toggleExpSort = () => { setExpDir((d) => (d === 'asc' ? 'desc' : 'asc')); setPage(1); };

    const startCreate = () => { setEditingCode(NEW_ROW); setDraft(emptyDraft()); };
    const startEdit = (p: PromoCode) => { setEditingCode(p.code); setDraft(fromPromo(p)); };
    const cancelEdit = () => { if (!saving) { setEditingCode(null); setDraft(emptyDraft()); } };

    const save = async () => {
        const isNew = editingCode === NEW_ROW;
        const code = draft.code.trim().toUpperCase();
        const value = toNum(draft.value);

        if (isNew && !code) return toast.error('Code is required.');
        if (isNew && draft.expiredAt && isExpired(draft.expiredAt)) return toast.error('Expiry date is already in the past.');
        if (value == null || value <= 0) return toast.error('Discount value must be greater than 0.');
        if (draft.type === 'percent' && value > 100) return toast.error('Percentage must be between 1 and 100.');

        if (draft.type === 'percent') {
            // The discount at the minimum order must not already exceed the cap, or the cap always binds and the % is moot.
            const max = toNum(draft.maxDiscount);
            const min = toNum(draft.minToApply);
            if (max != null && min != null && (min * value) / 100 > max) {
                return toast.error(`At the min order $${min}, ${value}% is $${((min * value) / 100).toFixed(2)}, above the max discount $${max}. Raise max discount or lower min order.`);
            }
        }

        const payload: PromoPayload = {
            code,
            discountPer: draft.type === 'percent' ? value : null,
            discountNum: draft.type === 'fixed' ? value : null,
            maxDiscountNum: draft.type === 'percent' ? toNum(draft.maxDiscount) : null,
            minToApply: toNum(draft.minToApply),
            expiredAt: draft.expiredAt ? new Date(draft.expiredAt).toISOString() : null,
        };

        setSaving(true);
        try {
            if (isNew) {
                await promoApi.create(payload);
                toast.success('Promotion created');
            } else {
                await promoApi.update(payload);
                toast.success('Promotion updated');
            }
            setEditingCode(null);
            setDraft(emptyDraft());
            setReloadToken((t) => t + 1);
        } catch {
            // axiosClient already toasts the error
        } finally {
            setSaving(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteCode) return;
        setDeleting(true);
        try {
            await promoApi.remove(deleteCode);
            toast.success('Promotion deleted');
            setDeleteCode(null);
            setReloadToken((t) => t + 1);
        } catch (err) {
            console.error('Failed to delete promotion:', err);
        } finally {
            setDeleting(false);
        }
    };

    const cellInput = 'h-9 w-24 rounded-md border border-slate-300 px-2 py-1 text-sm';

    const editRow = (isNew: boolean, key: string) => (
        <tr key={key} className="border-b border-slate-100 bg-slate-50 align-center">
            <td className="pl-2 pr-4 py-3">
                {isNew ? (
                    <FormField
                        value={draft.code}
                        onChange={(e) => setDraft((d) => ({ ...d, code: e.target.value }))}
                        placeholder="CODE"
                        inputClassName="h-9 w-27 uppercase mx-2"
                    />
                ) : (
                    <span className="block max-w-40 truncate font-semibold text-slate-900 text-left ml-3">{draft.code}</span>
                )}
            </td>
            <td className="px-4 py-3">
                <DropDownSelector<PromoType>
                    variant="compact"
                    value={draft.type}
                    onChange={(type) => setDraft((d) => ({ ...d, type }))}
                    options={[
                        { value: 'percent', label: 'Percentage (%)' },
                        { value: 'fixed', label: 'Fixed Amount' },
                    ]}
                    className='h-9'
                />
            </td>
            <td className="px-4 py-3">
                <input
                    type="number" min={0} value={draft.value}
                    onChange={(e) => setDraft((d) => ({ ...d, value: e.target.value }))}
                    placeholder={draft.type === 'percent' ? '%' : '$'}
                    className={cellInput}
                />
            </td>
            <td className="px-4 py-3">
                <input
                    type="number" min={0} value={draft.maxDiscount}
                    onChange={(e) => setDraft((d) => ({ ...d, maxDiscount: e.target.value }))}
                    disabled={draft.type !== 'percent'}
                    placeholder={draft.type === 'percent' ? '$ max' : '—'}
                    className={`${cellInput} disabled:bg-slate-100 disabled:text-slate-400`}
                />
            </td>
            <td className="px-4 py-3">
                <input
                    type="number" min={0} value={draft.minToApply}
                    onChange={(e) => setDraft((d) => ({ ...d, minToApply: e.target.value }))}
                    placeholder="$ min"
                    className={cellInput}
                />
            </td>
            <td className="px-4 py-3">
                <input
                    type="date" value={draft.expiredAt}
                    onChange={(e) => setDraft((d) => ({ ...d, expiredAt: e.target.value }))}
                    className={`${cellInput} w-36`}
                />
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                    <SubmitButton
                        type="button" loading={saving} loadingText={isNew ? 'Adding…' : 'Saving…'} onClick={save}
                        className="cursor-pointer rounded-md border border-transparent bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                    >
                        {isNew ? 'Add' : 'Save'}
                    </SubmitButton>
                    <button
                        type="button" onClick={cancelEdit} disabled={saving}
                        className="cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </td>
        </tr>
    );

    return (
        <section className="flex flex-1 flex-col gap-5">
            <header className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 pl-4">Promotions</h1>
                    <p className="text-sm text-slate-500 text-left pl-5">
                        {loading ? 'Loading…' : `${filtered.length} promo${filtered.length === 1 ? '' : 's'}`}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Search by code"
                        className="w-56 h-10 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-900"
                    />
                    <DropDownSelector<TypeFilter>
                        label="Type"
                        value={typeFilter}
                        onChange={(v) => { setTypeFilter(v); setPage(1); }}
                        options={[
                            { value: 'all', label: 'All' },
                            { value: 'percent', label: 'Percentage (%)' },
                            { value: 'fixed', label: 'Fixed Amount' },
                        ]}
                    />
                    <button
                        type="button"
                        onClick={startCreate}
                        disabled={editingCode === NEW_ROW}
                        className="shrink-0 cursor-pointer rounded-lg border-none bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
                    >
                        + New
                    </button>
                </div>
            </header>

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                {error ? (
                    <div className="p-8 text-center text-sm text-red-600">{error}</div>
                ) : loading ? (
                    <div className="p-8 text-center text-sm text-slate-400">Loading promotions…</div>
                ) : filtered.length === 0 && editingCode !== NEW_ROW ? (
                    <div className="p-8 text-center text-sm text-slate-400">No promotions found.</div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[820px] text-center text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                                        <th className="pr-4 pl-8 py-3 font-semibold text-left">Code</th>
                                        <th className="px-4 py-3 font-semibold">Type</th>
                                        <th className="px-4 py-3 font-semibold">Value</th>
                                        <th className="px-4 py-3 font-semibold">Max discount ($)</th>
                                        <th className="px-4 py-3 font-semibold">Min order ($)</th>
                                        <th className="px-4 py-3 font-semibold">
                                            <button
                                                type="button"
                                                onClick={toggleExpSort}
                                                className="inline-flex cursor-pointer items-center justify-center gap-1 border-none bg-transparent p-0 align-middle text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-900"
                                            >
                                                Expires
                                                <span className="text-[10px]">{expDir === 'asc' ? '▲' : '▼'}</span>
                                            </button>
                                        </th>
                                        <th className="w-32 px-4 py-3 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {editingCode === NEW_ROW && editRow(true, NEW_ROW)}
                                    {pageRows.map((p) =>
                                        editingCode === p.code ? (
                                            editRow(false, p.code)
                                        ) : (
                                            <tr key={p.code} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                                                <td className="pr-4 pl-6 py-3 text-left font-semibold text-slate-900">{p.code}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${promoType(p) === 'percent' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'}`}>
                                                        {promoType(p) === 'percent' ? 'Percentage' : 'Fixed Value'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 font-medium text-slate-700">
                                                    {promoType(p) === 'percent' ? `${p.discountPer}%` : `$${formatPrice(p.discountNum)}`}
                                                </td>
                                                <td className="px-4 py-3 text-slate-600">
                                                    {promoType(p) === 'percent' && p.maxDiscountNum != null ? `${formatPrice(p.maxDiscountNum)}` : '—'}
                                                </td>
                                                <td className="px-4 py-3 text-slate-600">
                                                    {p.minToApply != null ? `${formatPrice(p.minToApply)}` : '—'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {!p.expiredAt ? (
                                                        <span className="text-slate-400">No expiry</span>
                                                    ) : <span className={isExpired(p.expiredAt) ? "font-semibold text-red-600" : "text-slate-600"}>
                                                            {formatDate(p.expiredAt)}
                                                        </span>
                                                    }
                                                </td>
                                                <td className="w-32 px-4 py-3">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            type="button" onClick={() => startEdit(p)} disabled={editingCode != null}
                                                            className="cursor-pointer rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button" onClick={() => setDeleteCode(p.code)} disabled={editingCode != null}
                                                            className="cursor-pointer rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {lastPage > 1 && (
                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm">
                                <span className="text-slate-500">Page {safePage} of {lastPage}</span>
                                <Pagination page={safePage} totalPages={lastPage} onPageChange={setPage} />
                            </div>
                        )}
                    </>
                )}
            </div>

            <ConfirmModal
                isOpen={deleteCode != null}
                title="Delete promotion"
                content={<span>Delete <strong>{deleteCode}</strong>? This hides the code from customers.</span>}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
                isLoading={deleting}
                onClose={() => { if (!deleting) setDeleteCode(null); }}
                onConfirm={confirmDelete}
            />
        </section>
    );
}
