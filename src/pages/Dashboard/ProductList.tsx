import { useEffect, useMemo, useState } from 'react';
import { productApi } from '@/api/productApi';
import type { Product } from '@/types';
import plhImg from '/images/cloth-placeholder.jpeg';
import trashIcon from '@/assets/trash-icon.svg';
import { ConfirmModal } from '@/components';
import { toast } from 'react-toastify';
import { ProductForm, type ProductFormData } from './Form';
import StockEditor from './StockEditor';

function formatPrice(value?: number) {
    if (value === undefined || value === null) return '—';
    return `$${Number(value).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;
}

function displayPrice(product: Product): number | undefined {
    if (!product.stocks || product.stocks.length === 0) return undefined;
    const prices = product.stocks.map((s) => Number(s.promotionPrice ?? s.originalPrice));
    return prices.length ? Math.min(...prices) : undefined;
}

function totalStock(product: Product) {
    if (!product.stocks || product.stocks.length === 0) return null;
    return product.stocks.reduce((sum, s) => sum + (s.stock ?? 0), 0);
}

function EyeIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
            strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function BoxIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
            strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
        </svg>
    );
}

const LIMIT = 10;

function getPageNumbers(current: number, last: number): (number | '…')[] {
    if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);
    const pages: (number | '…')[] = [1];
    const start = Math.max(2, current - 1);
    const end = Math.min(last - 1, current + 1);
    if (start > 2) pages.push('…');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < last - 1) pages.push('…');
    pages.push(last);
    return pages;
}

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>('');
    const [debouncedSearch, setDebouncedSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [lastPage, setLastPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);
    const [reloadToken, setReloadToken] = useState<number>(0);
    const [formOpen, setFormOpen] = useState<boolean>(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [stockProduct, setStockProduct] = useState<Product | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search.trim());
            setPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const res = await productApi.getProducts({
                    page,
                    limit: LIMIT,
                    sortBy: 'latest',
                    search: debouncedSearch || undefined,
                });
                if (cancelled) return;
                setProducts(res?.data ?? []);
                setLastPage(res?.meta?.lastPage ?? 1);
                setTotal(res?.meta?.total ?? 0);
                setError(null);
            } catch (err) {
                console.error('Failed to load products:', err);
                if (!cancelled) setError('Failed to load products. Please try again.');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [page, debouncedSearch, reloadToken]);

    const goToPage = (p: number) => {
        if (p < 1 || p > lastPage || p === page || loading) return;
        setLoading(true);
        setPage(p);
    };

    const openCreateForm = () => {
        setEditingProduct(null);
        setFormOpen(true);
    };

    const editProduct = (product: Product) => {
        setEditingProduct(product);
        setFormOpen(true);
    };

    const closeForm = () => {
        if (submitting) return;
        setFormOpen(false);
        setEditingProduct(null);
    };

    const handleFormSubmit = async (data: ProductFormData) => {
        setSubmitting(true);
        try {
            // Price/stock live on ProductStock variants, not the product itself,
            // so the product form only handles title, description and image.
            const payload = {
                title: data.title,
                description: data.description,
                image: data.image || undefined,
            };

            if (editingProduct) {
                await productApi.updateProduct(editingProduct.id, payload);
                toast.success('Product updated successfully');
            } else {
                await productApi.createProduct(payload);
                toast.success('Product created successfully');
                setPage(1);
            }
            setFormOpen(false);
            setEditingProduct(null);
            setReloadToken((t) => t + 1);
        } catch (err) {
            // axiosClient already surfaces an error toast.
            console.error('Failed to save product:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const openDeleteModal = (product: Product) => {
        setSelectedProduct(product);
        setShowConfirmModal(true);
    };

    const closeDeleteModal = () => {
        if (deleting) return;
        setShowConfirmModal(false);
        setSelectedProduct(null);
    };

    const handleConfirmDelete = async () => {
        if (!selectedProduct) return;
        setDeleting(true);
        try {
            await productApi.deleteProduct(selectedProduct.id);
            toast.success('Product deleted successfully');
            setShowConfirmModal(false);
            setSelectedProduct(null);
            if (products.length === 1 && page > 1) {
                setPage(page - 1);
            } else {
                setReloadToken((t) => t + 1);
            }
        } catch (err) {
            console.error('Failed to delete product:', err);
        } finally {
            setDeleting(false);
        }
    };

    const pageNumbers = useMemo(() => getPageNumbers(page, lastPage), [page, lastPage]);

    return (
        <section className="flex flex-1 flex-col gap-5">
            <header className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 pl-4">Products</h1>
                    <p className="text-sm text-slate-500 text-left pl-5">
                        {loading ? 'Loading…' : `${total} product${total === 1 ? '' : 's'}`}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name…"
                        className="w-56 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-900"
                    />
                    <button
                        type="button"
                        onClick={openCreateForm}
                        className="shrink-0 cursor-pointer rounded-lg border-none bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                    >
                        + New
                    </button>
                </div>
            </header>

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                {error ? (
                    <div className="p-8 text-center text-sm text-red-600">{error}</div>
                ) : loading ? (
                    <div className="p-8 text-center text-sm text-slate-400">Loading products…</div>
                ) : products.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-400">No products found.</div>
                ) : (
                    <>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] text-center text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                                    <th className="px-4 py-3 font-semibold">Product</th>
                                    <th className="px-4 py-3 font-semibold">Description</th>
                                    <th className="px-4 py-3 font-semibold">Price</th>
                                    <th className="px-4 py-3 font-semibold">Rating</th>
                                    <th className="px-4 py-3 font-semibold">Stock</th>
                                    <th className="px-4 py-3 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => {
                                    const stock = totalStock(product);
                                    return (
                                        <tr
                                            key={product.id}
                                            className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50"
                                        >
                                            <td className="px-4 py-3 max-w-40">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={product.image || plhImg}
                                                        alt={product.title}
                                                        onError={(e) => {
                                                            e.currentTarget.src = plhImg;
                                                        }}
                                                        className="h-11 w-11 shrink-0 rounded-lg object-cover"
                                                    />
                                                    <span className="font-medium text-slate-900">{product.title}</span>
                                                </div>
                                            </td>
                                            <td className='truncate max-w-20'>
                                                {product.description}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-slate-700">
                                                {formatPrice(displayPrice(product))}
                                            </td>
                                            <td className="px-4 py-3 text-slate-700">
                                                <span className="inline-flex items-center gap-1">
                                                    {product.rating > 0 ? Number(product.rating).toFixed(1) : '-'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {stock === null ? (
                                                    <span className="text-slate-400">—</span>
                                                ) : (
                                                    <span
                                                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                            stock > 0
                                                                ? 'bg-green-50 text-green-700'
                                                                : 'bg-red-50 text-red-700'
                                                        }`}
                                                    >
                                                        {stock > 0 ? `${stock} in stock` : 'Out of stock'}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => editProduct(product)}
                                                        title="View / edit"
                                                        aria-label="View / edit product"
                                                        className="cursor-pointer border-none bg-transparent p-1.5 text-slate-500 transition-colors hover:text-slate-900"
                                                    >
                                                        <EyeIcon />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setStockProduct(product)}
                                                        title="Edit stock & pricing"
                                                        aria-label="Edit stock & pricing"
                                                        className="cursor-pointer border-none bg-transparent p-1.5 text-slate-500 transition-colors hover:text-slate-900"
                                                    >
                                                        <BoxIcon />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openDeleteModal(product)}
                                                        title="Remove product"
                                                        aria-label="Remove product"
                                                        className="cursor-pointer border-none bg-transparent p-1.5 transition-opacity hover:opacity-60"
                                                    >
                                                        <img src={trashIcon} alt="" className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {lastPage > 1 && (
                        <div className="flex flex-wrap items-center h-15 justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm">
                            <span className="text-slate-500">
                                Page {page} of {lastPage}
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => goToPage(page - 1)}
                                    disabled={page <= 1}
                                    className="cursor-pointer rounded-md border border-slate-200 bg-white px-2 py-2 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Prev
                                </button>
                                {pageNumbers.map((p, i) =>
                                    p === '…' ? (
                                        <span key={`ellipsis-${i}`} className="px-2 text-slate-400">
                                            …
                                        </span>
                                    ) : (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => goToPage(p)}
                                            aria-current={p === page ? 'page' : undefined}
                                            className={`min-w-8 cursor-pointer rounded-md border px-2 py-2 transition-colors ${
                                                p === page
                                                    ? 'border-slate-900 bg-slate-900 text-white'
                                                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    )
                                )}
                                <button
                                    type="button"
                                    onClick={() => goToPage(page + 1)}
                                    disabled={page >= lastPage}
                                    className="cursor-pointer rounded-md border border-slate-200 bg-white px-2 py-2 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                    </>
                )}
            </div>
            <ConfirmModal
                isOpen={showConfirmModal}
                title="Remove Product"
                content={
                    <span>
                        Are you sure you want to remove <strong>{selectedProduct?.title}</strong>? This action
                        cannot be undone.
                    </span>
                }
                confirmText="Remove"
                cancelText="Cancel"
                variant="danger"
                isLoading={deleting}
                onClose={closeDeleteModal}
                onConfirm={handleConfirmDelete}
            />

            {formOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                    onClick={closeForm}
                >
                    <div
                        className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ProductForm
                            key={editingProduct?.id ?? 'new'}
                            isEditing={!!editingProduct}
                            isSubmitting={submitting}
                            initialValues={
                                editingProduct
                                    ? {
                                          title: editingProduct.title,
                                          description: editingProduct.description ?? '',
                                          image: editingProduct.image ?? '',
                                      }
                                    : undefined
                            }
                            onSubmit={handleFormSubmit}
                            onCancel={closeForm}
                        />
                    </div>
                </div>
            )}

            {stockProduct && (
                <StockEditor
                    productId={stockProduct.id}
                    productTitle={stockProduct.title}
                    onClose={() => setStockProduct(null)}
                    onSaved={() => setReloadToken((t) => t + 1)}
                />
            )}
        </section>
    );
}
