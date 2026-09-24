import { useState, useEffect } from 'react';
import './productResultPage.css'
import ProductCard from '@/components/ProductCard/ProductCard'
import { mockProducts, type Product } from '@/mockdata/mockProduct';

export default function ProductResultPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9); // Mặc định PC là 9 (3x3)

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
        return mockProducts;
    };

    const products = getResultProducts();

    const totalPages = Math.ceil(products.length / itemsPerPage);
    
    const safeCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
    
    const startIndex = (safeCurrentPage - 1) * itemsPerPage;
    const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

    const handlePrev = () => {
        if (safeCurrentPage > 1) setCurrentPage(safeCurrentPage - 1);
    };

    const handleNext = () => {
        if (safeCurrentPage < totalPages) setCurrentPage(safeCurrentPage + 1);
    };

    return (
        <div className="product-result-container">
            <div className="product-result-header">
                <h2>Trending</h2>
                <span className="total-products">Total: {products.length} Products</span>
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
                        &larr; Prev
                    </button>

                    <div className="page-numbers">
                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                            <button
                                key={page}
                                className={`page-number-btn ${safeCurrentPage === page ? 'active' : ''}`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button 
                        className="page-nav-btn" 
                        onClick={handleNext} 
                        disabled={safeCurrentPage === totalPages}
                    >
                        Next &rarr;
                    </button>
                </div>
            )}
        </div>
    );
}