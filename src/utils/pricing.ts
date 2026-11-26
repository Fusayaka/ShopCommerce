import type { ProductStock } from "@/types";

export interface CardPrice {
    originalPrice: number;
    promotionPrice?: number;
    discount?: number;
}

export function getCardPrice(
    stocks?: ProductStock[],
    size?: string | null,
    color?: string | null,
): CardPrice {
    if (!stocks || stocks.length === 0) return { originalPrice: 0 };

    let relevant = stocks;
    if (color) {
        const byColor = relevant.filter((s) => s.color === color);
        if (byColor.length) relevant = byColor;
    }
    if (size) {
        const bySize = relevant.filter((s) => s.size === size);
        if (bySize.length) relevant = bySize;
    }

    const originalPrice = Math.min(...relevant.map((s) => Number(s.originalPrice)));

    const promotions = relevant
        .filter((s) => s.promotionPrice != null)
        .map((s) => Number(s.promotionPrice));
    const promotionPrice = promotions.length ? Math.min(...promotions) : undefined;

    const discount =
        promotionPrice !== undefined && originalPrice > 0
            ? Math.floor(((originalPrice - promotionPrice) / originalPrice) * 100)
            : undefined;

    return { originalPrice, promotionPrice, discount };
}