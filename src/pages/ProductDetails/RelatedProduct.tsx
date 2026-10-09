import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { ProductCard } from "@/components";
import { useParams } from "react-router-dom";
import { productApi } from "@/api/productApi";
import './relatedProduct.css'

export default function RelatedProduct() {
    const { productId } = useParams<{ productId: string }>();
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

    useEffect(() => {
        if (!productId) return;
        productApi.getRelatedProducts(Number(productId))
            .then(setRelatedProducts)
            .catch((err) => console.error("Error loading related products:", err));
    }, [productId]);

    if (relatedProducts.length === 0) return (
        <h2>No recommendation for this product</h2>
    );

    return (
        <div className="related-products-section">
            <h2 className="related-title">YOU MIGHT ALSO LIKE</h2>

            <div className="related-grid">
                {relatedProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                ))}
            </div>
        </div>
    );
}
