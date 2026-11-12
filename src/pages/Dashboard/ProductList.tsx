import { useEffect, useRef, useState } from 'react';
import { productApi } from '@/api/productApi';
import type { Product } from '@/types';
import plhImg from '/images/cloth-placeholder.jpeg';
import trashIcon from '@/assets/trash-icon.svg';
import upArrow from '@/assets/up-arrow.svg';
import downArrow from '@/assets/down-arrow.svg';
import filterMenu from '@/assets/filter.svg';
import { ConfirmModal, Pagination } from '@/components';
import { toast } from 'react-toastify';
import { ProductForm, type ProductFormData } from './Form';
import StockEditor from './StockEditor';
import '../ProductList/filter.css';
import { useSearchParams } from 'react-router-dom';

interface DualPriceRangeProps {
    minPrice: number;
    maxPrice: number;
    minLimit: number;
    maxLimit: number;
    onMinChange: (value: number) => void;
    onMaxChange: (value: number) => void;
}

function DualPriceRange({ minPrice, maxPrice, minLimit, maxLimit, onMinChange, onMaxChange }: DualPriceRangeProps) {
    const span = maxLimit - minLimit || 1;
    const minPercent = ((minPrice - minLimit) / span) * 100;
    const maxPercent = ((maxPrice - minLimit) / span) * 100;
    const minPos = `calc(${minPercent}% + ${9 - minPercent * 0.18}px)`;
    const maxPos = `calc(${maxPercent}% + ${9 - maxPercent * 0.18}px)`;

    return (
        <div className="dual-range-container">
            <div className="price-range-values">
                <span style={{ left: minPos }}>${minPrice}</span>
                <span style={{ left: maxPos }}>${maxPrice}</span>
            </div>
            <div
                className="price-slider-track-wrapper"
                style={{ '--min-pos': minPos, '--max-pos': maxPos } as React.CSSProperties}
            >
                <div className="price-slider-active-range"></div>
                <input
                    type="range"
                    min={minLimit}
                    max={maxLimit}
                    value={minPrice}
                    onChange={(e) => onMinChange(Number(e.target.value))}
                    className="price-range-input min-input"
                />
                <input
                    type="range"
                    min={minLimit}
                    max={maxLimit}
                    value={maxPrice}
                    onChange={(e) => onMaxChange(Number(e.target.value))}
                    className="price-range-input max-input"
                />
            </div>
        </div>
    );
}

interface PriceRange {
    minPrice: number;
    maxPrice: number;
}

function formatPrice(value?: number) {
    if (value === undefined || value === null) return '—';
    return `${Number(value).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;
}

function displayPrice(product: Product): PriceRange | undefined {
    if (!product.stocks || product.stocks.length === 0) return undefined;
    const prices = product.stocks.map((s) => Number(s.promotionPrice ?? s.originalPrice));
    return prices.length ? {
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices)
    } : undefined;
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

export default function ProductList() {
    const [searchParams, setSearchParams] = useSearchParams();

    // The applied query lives in the URL (?search=&minPrice=&maxPrice=&hasDiscount=&sort=&page=),
    // so it's shareable and survives refresh. The `tab` param is preserved by cloning.
    const page = Math.max(1, Number(searchParams.get('page')) || 1);
    const qSearch = searchParams.get('search') ?? '';
    const qMin = searchParams.get('minPrice');
    const qMax = searchParams.get('maxPrice');
    const qDiscount = searchParams.get('hasDiscount') === 'true';
    const qSort = searchParams.get('sort') || 'latest';

    const updateParams = (mutate: (p: URLSearchParams) => void) => {
        const params = new URLSearchParams(searchParams);
        mutate(params);
        setSearchParams(params);
    };

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>(qSearch);
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

    const [minLimit, setMinLimit] = useState<number>(0);
    const [maxLimit, setMaxLimit] = useState<number>(500);
    const [minPrice, setMinPrice] = useState<number>(qMin ? Number(qMin) : 0);
    const [maxPrice, setMaxPrice] = useState<number>(qMax ? Number(qMax) : 500);
    const [discountDraft, setDiscountDraft] = useState<boolean>(qDiscount);
    const [sortDraft, setSortDraft] = useState<string>(qSort);
    const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
    const [isPriceOpen, setIsPriceOpen] = useState<boolean>(true);
    const [isDiscountOpen, setIsDiscountOpen] = useState<boolean>(true);
    const [isSortOpen, setIsSortOpen] = useState<boolean>(true);

    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        let cancelled = false;
        productApi
            .getRoundRange()
            .then(({ min, max }) => {
                if (cancelled) return;
                setMinLimit(min);
                setMaxLimit(max);
                setMinPrice((prev) => (prev === 0 ? min : prev));
                setMaxPrice((prev) => (prev === 500 ? max : prev));
            })
            .catch((err) => console.error('Error loading price range:', err));
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        let cancelled = false;
        const min = searchParams.get('minPrice');
        const max = searchParams.get('maxPrice');

        (async () => {
            try {
                const res = await productApi.getProducts({
                    page: Math.max(1, Number(searchParams.get('page')) || 1),
                    limit: LIMIT,
                    sortBy: searchParams.get('sort') || 'latest',
                    search: searchParams.get('search') || undefined,
                    minPrice: min ? Number(min) : undefined,
                    maxPrice: max ? Number(max) : undefined,
                    hasDiscount: searchParams.get('hasDiscount') === 'true' || undefined,
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
    }, [searchParams, reloadToken]);

    const onSearchChange = (value: string) => {
        setSearch(value);
        if (searchTimer.current) clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => {
            updateParams((p) => {
                const v = value.trim();
                if (v) p.set('search', v);
                else p.delete('search');
                p.delete('page');
            });
        }, 400);
    };

    const goToPage = (p: number) => {
        if (p < 1 || p > lastPage || p === page || loading) return;
        setLoading(true);
        updateParams((params) => {
            if (p <= 1) params.delete('page');
            else params.set('page', String(p));
        });
    };

    const applyFilters = () => {
        updateParams((p) => {
            if (minPrice > minLimit) p.set('minPrice', String(minPrice));
            else p.delete('minPrice');
            if (maxPrice < maxLimit) p.set('maxPrice', String(maxPrice));
            else p.delete('maxPrice');
            if (discountDraft) p.set('hasDiscount', 'true');
            else p.delete('hasDiscount');
            if (sortDraft && sortDraft !== 'latest') p.set('sort', sortDraft);
            else p.delete('sort');
            p.delete('page');
        });
    };

    const clearFilters = () => {
        setMinPrice(minLimit);
        setMaxPrice(maxLimit);
        setDiscountDraft(false);
        setSortDraft('latest');
        updateParams((p) => {
            p.delete('minPrice');
            p.delete('maxPrice');
            p.delete('hasDiscount');
            p.delete('sort');
            p.delete('page');
        });
    };

    const hasActiveFilters =
        qMin !== null || qMax !== null || qDiscount || qSort !== 'latest';

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
                updateParams((p) => p.delete('page'));
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
                updateParams((p) => {
                    const prev = page - 1;
                    if (prev <= 1) p.delete('page');
                    else p.set('page', String(prev));
                });
            } else {
                setReloadToken((t) => t + 1);
            }
        } catch (err) {
            console.error('Failed to delete product:', err);
        } finally {
            setDeleting(false);
        }
    };


    return (
        <section className="flex flex-1 flex-col gap-5">
            <div className="relative">
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
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search by name…"
                        className="w-56 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-900"
                    />
                    <button
                        type="button"
                        onClick={() => setFiltersOpen((o) => !o)}
                        aria-expanded={filtersOpen}
                        className={`inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                            filtersOpen || hasActiveFilters
                                ? 'border-slate-900 bg-slate-900 text-white'
                                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                        Filters
                        <span className="text-xs">{filtersOpen ? '▲' : '▼'}</span>
                    </button>
                    <button
                        type="button"
                        onClick={openCreateForm}
                        className="shrink-0 cursor-pointer rounded-lg border-none bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                    >
                        + New
                    </button>
                </div>
            </header>

            {filtersOpen && (
                <div className="absolute right-0 top-full z-[30] -mt-10 flex w-full justify-end">
                    <div className="filter-card shadow-xl" style={{ width: 340, maxWidth: '100%' }}>
                        <div className="filter-header">
                            <h3>Filters</h3>
                            <img src={filterMenu} alt="" className="filter-main-icon" />
                        </div>

                        <hr className="filter-divider" />

                        <div className="filter-group">
                            <div className="filter-group-header" onClick={() => setIsPriceOpen(!isPriceOpen)}>
                                <span>Price Range</span>
                                <img src={isPriceOpen ? upArrow : downArrow} alt="toggle" className="filter-arrow-icon" />
                            </div>
                            {isPriceOpen && (
                                <DualPriceRange
                                    minPrice={minPrice}
                                    maxPrice={maxPrice}
                                    minLimit={minLimit}
                                    maxLimit={maxLimit}
                                    onMinChange={(val) => { if (val <= maxPrice) setMinPrice(val); }}
                                    onMaxChange={(val) => { if (val >= minPrice) setMaxPrice(val); }}
                                />
                            )}
                        </div>

                        <hr className="filter-divider" />

                        <div className="filter-group">
                            <div className="filter-group-header" onClick={() => setIsDiscountOpen(!isDiscountOpen)}>
                                <span>Only discount</span>
                                <img src={isDiscountOpen ? upArrow : downArrow} alt="toggle" className="filter-arrow-icon" />
                            </div>
                            {isDiscountOpen && (
                                <label className="filter-switch">
                                    <input
                                        type="checkbox"
                                        checked={discountDraft}
                                        onChange={(e) => setDiscountDraft(e.target.checked)}
                                    />
                                    <span className="filter-slider"></span>
                                </label>
                            )}
                        </div>

                        <hr className="filter-divider" />

                        <div className="filter-group">
                            <div className="filter-group-header" onClick={() => setIsSortOpen(!isSortOpen)}>
                                <span>Sort by</span>
                                <img src={isSortOpen ? upArrow : downArrow} alt="toggle" className="filter-arrow-icon" />
                            </div>
                            {isSortOpen && (
                                <div className="filter-select-wrapper">
                                    <select
                                        value={sortDraft}
                                        onChange={(e) => setSortDraft(e.target.value)}
                                        className="filter-select"
                                    >
                                        <option value="latest">Latest</option>
                                        <option value="rating-desc">Rating: High → Low</option>
                                        <option value="rating-asc">Rating: Low → High</option>
                                        <option value="price-asc">Price: Low → High</option>
                                        <option value="price-desc">Price: High → Low</option>
                                        <option value="title-asc">Name: A → Z</option>
                                        <option value="title-desc">Name: Z → A</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        <button className="filter-apply-btn" onClick={applyFilters}>
                            Apply Filter
                        </button>
                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                style={{
                                    width: '100%',
                                    marginTop: 10,
                                    background: 'transparent',
                                    border: '1px solid #d1d1d1',
                                    borderRadius: 24,
                                    padding: 10,
                                    cursor: 'pointer',
                                    fontSize: 14,
                                    color: '#555',
                                }}
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            )}
            </div>

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
                                    <th className="px-4 py-3 font-semibold">Price ($)</th>
                                    <th className="px-4 py-3 font-semibold">Rating</th>
                                    <th className="px-4 py-3 font-semibold">Stock</th>
                                    <th className="px-4 py-3 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => {
                                    const stock = totalStock(product);
                                    const prices = displayPrice(product);
                                    let priceString;
                                    if (!prices) {priceString = '-';}
                                    else 
                                        {
                                            priceString = (prices.minPrice === prices.maxPrice) ? `${formatPrice(prices.minPrice)}`
                                             : `${formatPrice(prices.minPrice)} - ${formatPrice(prices.maxPrice)}`;
                                        }
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
                                                {priceString}
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
                                                        {stock > 0 ? `${stock}` : '0'}
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
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm">
                            <span className="text-slate-500">
                                Page {page} of {lastPage}
                            </span>
                            <Pagination page={page} totalPages={lastPage} onPageChange={goToPage} />
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
