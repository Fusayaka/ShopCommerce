import { useState, useEffect } from 'react';
import { ProductCard } from "@/components";
import { type Product } from '@/types';
import filterMenu from '@/assets/filter.svg'
import { useSearchParams } from 'react-router-dom';
import { productApi, type GetProductsQuery } from '@/api/productApi';

interface ProductResultPageProps {
    onOpenFilter?: () => void;
}

export default function ProductResultPage({ onOpenFilter }: ProductResultPageProps) {
    const [searchParams, setSearchParams] = useSearchParams();

    const currentPage = Number(searchParams.get('page')) || 1;
    const [itemsPerPage, setItemsPerPage] = useState(9);

    const sort = searchParams.get('sort') || 'latest';
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        setSearchParams(params);
    };

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('sort', value);
        params.delete('page');
        setSearchParams(params);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setItemsPerPage(6);
            } else {
                setItemsPerPage(9);
            }
        };

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        let active = true;

        const ratingParam = searchParams.get('rating');
        const minPriceParam = searchParams.get('minPrice');
        const maxPriceParam = searchParams.get('maxPrice');
        const searchParam = searchParams.get('search');

        const query: GetProductsQuery = {
            page: currentPage,
            limit: itemsPerPage,
            search: searchParam ?? undefined,
            rating: ratingParam ? Number(ratingParam) : undefined,
            minPrice: minPriceParam ? Number(minPriceParam) : undefined,
            maxPrice: maxPriceParam ? Number(maxPriceParam) : undefined,
            hasDiscount: searchParams.get('hasDiscount') === 'true' || undefined,
            sortBy: searchParams.get('sort') || 'latest',
        };

        const fetchProducts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const { data, meta } = await productApi.getProducts(query);
                if (!active) return;
                setProducts(data ?? []);
                setTotal(meta?.total ?? 0);
                setTotalPages(meta?.lastPage ?? 1);
            }
            catch {
                if (!active) return;
                setError("Could not load products.");
                setProducts([]);
            }
            finally {
                if (active) setIsLoading(false);
            }
        };

        fetchProducts();
        return () => { active = false; };
    }, [searchParams, currentPage, itemsPerPage]);

    const safeCurrentPage = Math.min(currentPage, Math.max(1, totalPages));

    useEffect(() => {
        if (!isLoading && currentPage > totalPages) {
            const params = new URLSearchParams(searchParams);
            params.set('page', '1');
            setSearchParams(params);
        }
    }, [isLoading, currentPage, totalPages, searchParams, setSearchParams]);

    const handlePrev = () => {
        if (safeCurrentPage > 1) handlePageChange(safeCurrentPage - 1);
    };

    const handleNext = () => {
        if (safeCurrentPage < totalPages) handlePageChange(safeCurrentPage + 1);
    };

    const getPaginationItems = (currentPage: number, totalPages: number) => {
        const items: (number | string)[] = [];
        if (totalPages <= 5){
            for (let i = 1; i <= totalPages; i++){
                items.push(i);
            }
        }
        else {
            items.push(1);

            if (currentPage > 3){
                items.push("...");
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++){
                items.push(i);
            }

            if (totalPages - 2 > currentPage){
                items.push("...");
            }

            items.push(totalPages);
        }

        return items;
    };

    const paginationItems= getPaginationItems(safeCurrentPage, totalPages);

    const navBtn = "flex flex-none items-center justify-center gap-2 rounded-lg border border-[#eaeaea] bg-white px-[18px] py-2.5 text-sm font-medium text-black transition-all cursor-pointer enabled:hover:border-black enabled:hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:border-[#f5f5f5] disabled:text-[#b3b3b3] max-[576px]:p-3";
    const pageCell = "flex h-[38px] w-[38px] items-center justify-center max-[576px]:h-9 max-[576px]:w-9";
    const statusCls = "py-[60px] text-center text-base text-[#00000099]";

    return (
        <div className="flex w-full min-w-0 flex-1 flex-col">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="m-0 text-[28px] font-bold text-black max-[576px]:text-2xl">Trending</h2>

                <div className="flex items-center gap-3">
                    <span className="text-sm font-normal text-[#666]">Total: {total} Products</span>

                    <button
                        className="hidden h-9 w-9 cursor-pointer items-center justify-center rounded-[25%] border border-[#eaeaea] bg-[#f2f0f1] text-black transition-all hover:bg-[#e0e0e0] max-md:flex [&_img]:h-[85%] [&_img]:w-full"
                        onClick={onOpenFilter}
                    >
                        <img src={filterMenu} alt="filter" />
                    </button>
                </div>
            </div>
            <div className="mb-5 flex items-center justify-end gap-2">
                <label htmlFor="product-sort-select" className="text-sm font-medium text-[#666]">Sort by</label>
                <select
                    id="product-sort-select"
                    value={sort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="cursor-pointer appearance-none rounded-lg border border-[#eaeaea] bg-white bg-no-repeat py-[9px] pr-9 pl-3.5 text-sm font-medium text-black transition-colors [background-position:right_12px_center] hover:border-black focus:border-black focus:outline-none"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")" }}
                >
                    <option value="latest">Latest</option>
                    <option value="rating-asc">Rating &#8593;</option>
                    <option value="rating-desc">Rating &#8595;</option>
                    <option value="title-asc">Name &#8593;</option>
                    <option value="title-desc">Name &#8595;</option>
                    <option value="price-asc">Price &#8593;</option>
                    <option value="price-desc">Price &#8595;</option>
                </select>
            </div>

            {isLoading ? (
                <div className={statusCls}>Loading...</div>
            ) : error ? (
                <div className={statusCls}>{error}</div>
            ) : products.length === 0 ? (
                <div className={statusCls}>No products found.</div>
            ) : (
                <div className="grid grid-cols-3 gap-x-5 gap-y-8 max-md:grid-cols-2 max-md:gap-x-[10%] max-md:gap-y-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="mt-12 flex w-full items-center justify-between border-t border-[#f0f0f0] pt-6 max-[576px]:mt-8 max-[576px]:flex-nowrap max-[576px]:gap-1">
                    <button
                        className={navBtn}
                        onClick={handlePrev}
                        disabled={safeCurrentPage === 1}
                    >
                        &larr; <span className="max-md:hidden">Prev</span>
                    </button>

                    <div className="flex items-center gap-1 max-[576px]:gap-1">
                        {paginationItems.map((item, index) => (
                            item === "..." ? (
                                <span key={`ellipsis-${index}`} className={`${pageCell} text-base font-bold text-[#666] select-none max-[576px]:text-[13px]`}>
                                    ...
                                </span>
                            ): (
                                <button
                                    key={item}
                                    className={`${pageCell} cursor-pointer rounded-lg border-none text-sm font-medium transition-all max-[576px]:text-[13px] ${
                                        safeCurrentPage === item
                                            ? 'bg-black font-semibold text-white shadow-[0_4px_10px_rgba(0,0,0,0.15)]'
                                            : 'bg-transparent text-[#666] hover:bg-[#f2f0f1] hover:text-black'
                                    }`}
                                    onClick={() => handlePageChange(item as number)}
                                >
                                    {item}
                                </button>
                            )
                        ))}
                    </div>

                    <button
                        className={navBtn}
                        onClick={handleNext}
                        disabled={safeCurrentPage === totalPages}
                    >
                        <span className="max-md:hidden">Next</span> &rarr;
                    </button>
                </div>
            )}
        </div>
    );
}
