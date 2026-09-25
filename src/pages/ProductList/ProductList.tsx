import { useState, useEffect } from "react";
import Filter from "./Filter";
import ProductResultPage from "./ProductResultPage";
import './productList.css'
import { Link, useSearchParams } from "react-router-dom";


export default function ProductList(){
    const [isDesktop, setIsDesktop] = useState(true);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth > 768);
        };

        handleResize();

        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const hanleApplyFilter = (filter: {
        rating: string;
        minPrice: number;
        maxPrice: number;
        isDiscountOnly: boolean;
    }) => {
        const params = new URLSearchParams(searchParams);

        if (filter.rating && filter.rating !== "All Ratings") {
            params.set("rating", filter.rating);
        } else {
            params.delete("rating");
        }

        if (filter.minPrice > 0) {
            params.set("minPrice", filter.minPrice.toString());
        } else {
            params.delete("minPrice");
        }

        if (filter.maxPrice < 500) {
            params.set("maxPrice", filter.maxPrice.toString());
        } else {
            params.delete("maxPrice");
        }

        if (filter.isDiscountOnly) {
            params.set("discount", "true");
        } else {
            params.delete("discount");
        }

        setSearchParams(params);
    };

    return (
        <section className="product-list-section">
            <nav className='detail-breadcrumb'>
                <Link to='/'>Home</Link> 
                {'  >  '}
                <Link to='/products'>Product</Link>
            </nav>
            
            <div className="product-list-container">
            <div className={`filter-sidebar-wrapper ${!isDesktop && isMobileFilterOpen ? 'mobile-modal-open' : ''}`}>
                {!isDesktop && isMobileFilterOpen && (
                    <div className="mobile-overlay" onClick={() => setIsMobileFilterOpen(false)}></div>
                )}
                
                <div className="filter-content">
                    <Filter 
                        onClose={() => setIsMobileFilterOpen(false)} 
                        onApplyFilter={hanleApplyFilter}
                    />
                </div>
            </div>

            <ProductResultPage onOpenFilter={() => setIsMobileFilterOpen(true)} />
        </div>
        </section>
    );
}