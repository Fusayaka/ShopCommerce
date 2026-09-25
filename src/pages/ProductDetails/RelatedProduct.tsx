import mockProducts from "@/mockdata/products";
import type { Product } from "@/types";
import ProductCard from "@/components/ProductCard/ProductCard";
import { useParams } from "react-router-dom";
import './relatedProduct.css'

function getRelatedProducts(product_id: string){
    return mockProducts
        .filter(p => p.id != product_id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
}

export default function RelatedProduct() {
    const { productId } = useParams<{ productId: string }>();
    
    const relatedProducts: Product[] = getRelatedProducts(productId || "");
    
    if (relatedProducts.length == 0) return (
        <h2>No recommendation for this product</h2>
    );
    return (
        <div className="related-products-section">
            <h2 className="related-title">YOU MIGHT ALSO LIKE</h2>
            
            <div className="related-grid">
                {relatedProducts.map((product) => (
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
        </div>
    );
}