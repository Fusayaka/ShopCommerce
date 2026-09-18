import { mockProducts, type Product } from "@/mockdata/mockProduct";
import ProductCard from "@/components/ProductCard/ProductCard";
import './trending.css'
import { useEffect, useState } from "react";

function getProduct(): Product[]{
    return mockProducts;
}

export default function Trending(){
    const getResponsiveItemCount = () => {
        if (typeof window !== undefined){
            return window.innerWidth <= 768 ? 2 : 4;
        }
        return 2;
    }

    const [visibleCount, setVisibleCount] = useState(getResponsiveItemCount());
    const [itemsPerLoad, setItemPerLoad] = useState(getResponsiveItemCount());
    const products = getProduct()
    const productsLength = products.length;

    const handleLoadMore = () => {
        if (visibleCount <= productsLength){ 
            setVisibleCount((prev) => prev + itemsPerLoad);
        }
        else{
            window.alert();
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
                        image={prod.imagePath}
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