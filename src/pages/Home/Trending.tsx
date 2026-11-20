import type { Product } from "@/types";
import { ProductCard } from "@/components";
import { useEffect, useState } from "react";
import { productApi } from "@/api/productApi";

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
        productApi.getProducts({ limit: ROWS * getResponsiveItemCount() })
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
        <section className="bg-white px-[5%] py-[60px] text-black max-md:px-[30px] max-md:py-10">
            <h2 className="m-0 mb-[50px] text-center text-5xl font-black tracking-[1px] max-md:mb-[30px] max-md:text-[32px]">TRENDING</h2>
            <div className="mx-auto mb-10 grid max-w-[1040px] grid-cols-4 gap-5 max-md:grid-cols-2 max-md:gap-x-[10%] max-md:gap-y-4">
                {products.slice(0, visibleCount).map((prod: Product) => (
                    <ProductCard key={prod.id} {...prod} />
                ))}
            </div>
            {
                visibleCount < productsLength && (
                    <div className="flex justify-center">
                        <button className="cursor-pointer rounded-[62px] border border-[#00000033] bg-transparent px-10 py-3 text-base font-medium text-black transition-all duration-200 hover:border-black hover:bg-black hover:text-white" onClick={handleLoadMore}>View More</button>
                    </div>
                )
            }
        </section>
    );
}