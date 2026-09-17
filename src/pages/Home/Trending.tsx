import { mockProducts, type Product } from "@/mockdata/mockProduct";
import ProductCard from "@/components/ProductCard/ProductCard";
import './trending.css'
import { useState } from "react";

const INITIAL_ITEMS = 2;
const ITEMS_PER_LOAD = 2;

function getProduct(): Product[]{
    return mockProducts;
}

export default function Trending(){
    const [visibleCount, setVisibleCount] = useState(INITIAL_ITEMS);
    const products = getProduct()
    const productsLength = products.length;

    const handleLoadMore = () => {
        if (visibleCount <= productsLength){ 
            setVisibleCount((prev) => prev + ITEMS_PER_LOAD);
        }
        else{
            window.alert()
        }
    }


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