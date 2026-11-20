import { Link } from "react-router-dom";
import plhImg from '/images/cloth-placeholder.jpeg'
import StarRating from "../StarRating/StarRating";
import { getCardPrice } from "@/utils/pricing";
import type { Product } from "@/types";

function isNewProduct(createdAt?: string): boolean {
    if (!createdAt) return true;
    const created = new Date(createdAt);
    if (Number.isNaN(created)) return true;
    const previousThirtyDays = new Date();
    previousThirtyDays.setDate(previousThirtyDays.getDate() - 30);
    return previousThirtyDays < created;
}

export default function ProductCard(product: Product){
    const {originalPrice, promotionPrice, discount} = getCardPrice(product.stocks);
    const rating = Number(product.rating);
    const price = promotionPrice ?? originalPrice;
    const isNew = isNewProduct(product.createdAt);

    return (
        <Link
            to={`/product/${product.id}`}
            className="group flex min-w-0 cursor-pointer flex-col gap-2 text-black no-underline transition-transform duration-200 hover:-translate-y-1 hover:rounded-2xl hover:shadow-[0_0_0_2px_cyan,0_10px_20px_rgba(0,255,255,0.3)]"
        >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#f0eeed]">
                <img
                    src={product.image || plhImg}
                    alt={product.title}
                    loading="lazy"
                    className="absolute inset-0 block h-full w-full object-cover object-center"
                />
            </div>

            <h4 className="mt-0.5 mb-0 overflow-hidden px-[10%] text-base font-bold text-ellipsis whitespace-nowrap max-md:text-center max-md:text-[15px]">
                {product.title}
            </h4>

            {rating > 0 ? (
                <div className="flex items-center justify-center gap-1.5 text-[13px]">
                    <span className="inline-flex">
                        <StarRating rating={rating}/>
                    </span>
                    <span className="font-normal text-[#666]">{rating}/5</span>
                </div>
            ) : isNew ? (
                <div className="flex items-center justify-center gap-1.5 text-[13px]">
                    <span className="inline-flex shrink-0 items-center justify-center rounded-[62px] bg-[#00bcd41a] px-2.5 py-[3px] text-xs leading-none font-semibold tracking-[0.3px] text-[#0097a7]">New</span>
                </div>
            ) : (
                <div className="flex items-center justify-center gap-1.5 text-[13px]">
                    <span className="text-[13px] font-normal text-[#999] italic">No reviews</span>
                </div>
            )}

            <div className="flex h-7 w-full items-center justify-center gap-2">
                <div className="flex shrink-0 items-baseline gap-2">
                    <span className="shrink-0 text-[15px] leading-none font-bold max-md:text-sm">${price}</span>
                    {promotionPrice != null && (
                        <span className="shrink-0 text-sm leading-none font-bold text-[#0000004d] line-through max-md:text-[13px]">${originalPrice}</span>
                    )}
                </div>
                {promotionPrice != null && discount ? (
                    <span className="inline-flex shrink-0 items-center justify-center rounded-[62px] bg-[#ff33331a] px-2 py-1 text-[13px] leading-none font-medium text-[#ff3333]">-{discount}%</span>
                ) : null}
            </div>
        </Link>
    );
}