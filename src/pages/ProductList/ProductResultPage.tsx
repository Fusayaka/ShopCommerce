import { useState, useEffect } from 'react';
import './productResultPage.css'
import { ProductCard } from "@/components";
import { type Product } from '@/types';
import filterMenu from '@/assets/filter.png'
import { useSearchParams } from 'react-router-dom';
import { CONFIG } from '@/config';

interface ProductResultPageProps {
    onOpenFilter?: () => void;
}

export default function ProductResultPage({ onOpenFilter }: ProductResultPageProps) {
    const [searchParams, setSearchParams] = useSearchParams();

    const currentPage = Number(searchParams.get('page')) || 1;
    const [itemsPerPage, setItemsPerPage] = useState(9);

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
        const controller = new AbortController();

        const params = new URLSearchParams(searchParams);
        params.set('page', currentPage.toString());
        params.set('limit', itemsPerPage.toString());

        const fetchProducts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await fetch(`${CONFIG.API_URL}/products?${params.toString()}`, {
                    signal: controller.signal,
                });
                if (!res.ok) throw new Error(`Request failed: ${res.status}`);

                const json = await res.json();
                setProducts(json.data ?? []);
                setTotal(json.meta?.total ?? 0);
                setTotalPages(json.meta?.lastPage ?? 1);
            }
            catch (err) {
                if (err instanceof Error && err.name === "AbortError") return;
                setError("Could not load products.");
                setProducts([]);
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
        return () => controller.abort();
    }, [searchParams, currentPage, itemsPerPage]);

    const safeCurrentPage = Math.min(currentPage, Math.max(1, totalPages));

    useEffect(() => {
        if (!isLoading && currentPage > totalPages) {
            handlePageChange(1);
        }
    }, [isLoading, currentPage, totalPages]);

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

    return (
        <div className="product-result-container">
            <div className="product-result-header">
                <h2>Trending</h2>

                <div className="product-result-meta">
                    <span className="total-products">Total: {total} Products</span>

                    <button
                        className="mobile-filter-btn"
                        onClick={onOpenFilter}
                    >
                        <img src={filterMenu} alt="filter" />
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="product-result-status">Loading...</div>
            ) : error ? (
                <div className="product-result-status">{error}</div>
            ) : products.length === 0 ? (
                <div className="product-result-status">No products found.</div>
            ) : (
                <div className="product-grid">
                    {products.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="pagination-container">
                    <button
                        className="page-nav-btn"
                        onClick={handlePrev}
                        disabled={safeCurrentPage === 1}
                    >
                        &larr; <span className="nav-text">Prev</span>
                    </button>

                    <div className="page-numbers">
                        {paginationItems.map((item, index) => (
                            item === "..." ? (
                                <span key={`ellipsis-${index}`} className='page-ellipsis'>
                                    ...
                                </span>
                            ): (
                                <button
                                    key={item}
                                    className={`page-number-btn ${safeCurrentPage === item ? 'active' : ''}`}
                                    onClick={() => handlePageChange(item as number)}
                                >
                                    {item}
                                </button>
                            )
                        ))}
                    </div>

                    <button
                        className="page-nav-btn"
                        onClick={handleNext}
                        disabled={safeCurrentPage === totalPages}
                    >
                        <span className="nav-text">Next</span> &rarr;
                    </button>
                </div>
            )}
        </div>
    );
}
