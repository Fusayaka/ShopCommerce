import { useState, useEffect } from "react";
import Filter from "./Filter";
import ProductResultPage from "./ProductResultPage";
import { Link, useSearchParams } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

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

    const handleApplyFilter = (filter: {
        rating: string;
        minPrice: number;
        maxPrice: number;
        minLimit: number;
        maxLimit: number;
        isDiscountOnly: boolean;
    }) => {
        const params = new URLSearchParams(searchParams);

        if (filter.rating && filter.rating !== "0") {
            params.set("rating", filter.rating);
        } else {
            params.delete("rating");
        }

        if (filter.minPrice > filter.minLimit) {
            params.set("minPrice", filter.minPrice.toString());
        } else {
            params.delete("minPrice");
        }

        if (filter.maxPrice < filter.maxLimit) {
            params.set("maxPrice", filter.maxPrice.toString());
        } else {
            params.delete("maxPrice");
        }

        if (filter.isDiscountOnly) {
            params.set("hasDiscount", "true");
        } else {
            params.delete("hasDiscount");
        }

        params.delete("page");

        setSearchParams(params);
    };

    return (
        <section className="px-[5%] py-6 max-md:px-[30px] max-md:py-5">
            <nav className='mx-auto mb-6 w-full p-0 text-left text-sm text-[#666] [&_a]:text-[#666] [&_a]:no-underline [&_a:hover]:text-black [&_a:hover]:underline'>
                <Link to={ROUTES.HOME}>Home</Link>
                {'  >  '}
                <span>Product</span>
            </nav>

            <div className="mx-auto flex w-full max-w-[1150px] items-start gap-8 max-md:flex-col">
                <div className={`w-[30%] shrink-0 max-md:w-full ${isMobileFilterOpen ? 'max-md:fixed max-md:inset-0 max-md:z-[1000] max-md:block max-md:h-screen max-md:w-screen' : 'max-md:hidden'}`}>
                    {!isDesktop && isMobileFilterOpen && (
                        <div className="absolute inset-0 h-full w-full bg-black/50" onClick={() => setIsMobileFilterOpen(false)}></div>
                    )}

                    <div className="max-md:absolute max-md:bottom-0 max-md:left-[10%] max-md:z-[1001] max-md:max-h-[85vh] max-md:w-[80%] max-md:overflow-hidden max-md:rounded-t-[20px] max-md:bg-white max-md:shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
                        <Filter
                            onClose={() => setIsMobileFilterOpen(false)}
                            onApplyFilter={handleApplyFilter}
                        />
                    </div>
                </div>

                <ProductResultPage onOpenFilter={() => setIsMobileFilterOpen(true)} />
            </div>
        </section>
    );
}