import { useState, useEffect } from 'react';
import './productResultPage.css'
import ProductCard from '@/components/ProductCard/ProductCard'
import { mockProducts, type Product } from '@/mockdata/mockProduct';
import filterMenu from '@/assets/filter.png'
import { useSearchParams } from 'react-router-dom';

interface ProductResultPageProps {
    onOpenFilter?: () => void;
}

export default function ProductResultPage({ onOpenFilter }: ProductResultPageProps) {
    const [searchParams, setSearchParams] = useSearchParams();

    const currentPage = Number(searchParams.get('page')) || 1;
    const [itemsPerPage, setItemsPerPage] = useState(9);

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

    const getResultProducts = (): Product[] => {
        return mockProducts.concat(mockProducts, mockProducts);
    };

    const products = getResultProducts();

    const totalPages = Math.ceil(products.length / itemsPerPage);
    
    const safeCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
    
    const startIndex = (safeCurrentPage - 1) * itemsPerPage;
    const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

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
                    <span className="total-products">Total: {products.length} Products</span>

                    <button 
                        className="mobile-filter-btn" 
                        onClick={onOpenFilter}
                    >
                        <img src={filterMenu} alt="filter" />
                    </button>
                </div>
            </div>
            
            <div className="product-grid">
                {currentProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        id={product.id}
                        title={product.title}
                        rating={product.rating}
                        price={product.price}
                        originalPrice={product.originalPrice}
                        image={product.image} 
                        discount={product.discount}
                    />
                ))}
            </div>

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