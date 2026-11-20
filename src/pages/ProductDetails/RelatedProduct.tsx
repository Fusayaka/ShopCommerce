import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { ProductCard } from "@/components";
import { useParams } from "react-router-dom";
import { productApi } from "@/api/productApi";

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
        <h2 className="px-[5%] py-10 text-center text-2xl font-medium text-black">No recommendation for this product</h2>
    );

    return (
        <div className="w-full bg-white px-[5%] py-[60px] text-black max-md:px-[30px] max-md:py-10">
            <h2 className="m-0 mb-[50px] text-center text-[36px] leading-tight font-black tracking-[1px] uppercase max-md:mb-[30px] max-md:text-[32px]">YOU MIGHT ALSO LIKE</h2>

            <div className="mx-auto mb-5 grid max-w-[1040px] grid-cols-4 gap-5 max-md:grid-cols-2 max-md:gap-[3%] max-md:gap-x-[10%]">
                {relatedProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                ))}
            </div>
        </div>
    );
}
