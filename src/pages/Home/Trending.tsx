import type { Product } from "@/types";
import { ProductCard } from "@/components";
import './trending.css'
import { useEffect, useState } from "react";
import { CONFIG } from "@/config";

const ROWS = 3;

export default function Trending(){
    const getResponsiveItemCount = () => {
        if (typeof window !== "undefined"){
            return window.innerWidth <= 768 ? 2 : 4;
        }
        return 2;
    }

    const [products, setProducts] = useState<Product[]>([]);

    const [visibleCount, setVisibleCount] = useState(getResponsiveItemCount());
    const [itemsPerLoad, setItemPerLoad] = useState(getResponsiveItemCount());
    
    const productsLength = products.length;

    useEffect(() => {
        fetch(`${CONFIG.API_URL}/products?limit=${ROWS * getResponsiveItemCount()}`)
            .then(res => res.json())
            .then(json => setProducts(json.data ?? []))
            .catch(err => console.error("Error when loading data:", err));
    }, []);

    const handleLoadMore = () => {
        if (visibleCount < productsLength){ 
            setVisibleCount((prev) => prev + itemsPerLoad);
        }
    }

    useEffect(() => {
        const handleResize = () => {
            const curResponsiveCount = getResponsiveItemCount();
            setItemPerLoad(curResponsiveCount);
            setVisibleCount((prev) => {
                const rows = Math.max(ROWS, Math.ceil(prev / curResponsiveCount));
                return rows * curResponsiveCount;
            });
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    },[])

    return (
        <section className="trending-section">
            <h2 className="trending-title">TRENDING</h2>
            <div className="trending-grid">
                {products.slice(0, visibleCount).map((prod: Product) => (
                    <ProductCard
                        key={prod.id}
                        id={prod.id}
                        title={prod.title}
                        rating={prod.rating}
                        originalPrice={prod.originalPrice}
                        promotionPrice={prod.promotionPrice}
                        image={prod.image}
                        discount={prod.discount}
                    />
                ))}
            </div>
            {
                visibleCount < productsLength && (
                    <div className="view-all-container">
                        <button className="view-all-btn" onClick={handleLoadMore}>View More</button>
                    </div>
                )
            }
        </section>
    );
}