import { mockProducts } from "@/mockdata";
import type { Product } from "@/types";
import ProductCard from "@/components/ProductCard/ProductCard";
import './trending.css'
import { useEffect, useState } from "react";

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
        return setProducts(mockProducts);
        // fetch("http://localhost:8000/api/products")
        //     .then(res => res.json())
        //     .then(data => setProducts(data))
        //     .catch(err => console.error("Error when loading data:", err));
    }, []);

    const handleLoadMore = () => {
        if (visibleCount < productsLength){ 
            setVisibleCount((prev) => prev + itemsPerLoad);
        }
    }

    useEffect(() => {
        const handleResize = () => {
            const curResponsiveCount = window.innerWidth <= 768 ? 2 : 4;
            setItemPerLoad(curResponsiveCount);
            setVisibleCount((prev) => Math.max(prev, curResponsiveCount));
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
                        price={prod.price}
                        originalPrice={prod.originalPrice}
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