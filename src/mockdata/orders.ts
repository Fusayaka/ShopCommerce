// src/mockdata/orders.ts
// Mirrors the `orders` + `order_items` seed (placed orders only: checkout / completed).
// Order items reference a variant via stockId; title/image are snapshotted from the
// product at purchase time. total = subtotal - discount + deliveryFee.

import mockProducts from "./products";
import { getStockId, type Size, type Color } from "./productStocks";

export type OrderStatus = "pending" | "checkout" | "completed" | "cancelled";

export interface OrderItem {
    id: number;
    orderId: number;
    stockId: number;
    title: string;
    image?: string;
    quantity: number;
    priceAtPurchase: number;
    totalPrice: number;
}

export interface Order {
    id: number;
    userId: number;
    status: OrderStatus;
    subtotal: number;
    discount: number;
    deliveryFee: number;
    total: number;
    promoCode?: string;
    items: OrderItem[];
}

// [productId, size, color, quantity, priceAtPurchase]
type RawItem = [number, Size, Color, number, number];

interface RawOrder {
    id: number;
    userId: number;
    status: OrderStatus;
    subtotal: number;
    discount: number;
    deliveryFee: number;
    promoCode?: string;
    items: RawItem[];
}

const RAW_ORDERS: RawOrder[] = [
    { id: 1, userId: 1000, status: "completed", subtotal: 240, discount: 20, deliveryFee: 15, promoCode: "SALE20", items: [[1, "L", "Blue", 2, 120]] },
    { id: 2, userId: 1000, status: "completed", subtotal: 144, discount: 0, deliveryFee: 15, items: [[2, "M", "Green", 1, 144]] },
    { id: 3, userId: 1000, status: "completed", subtotal: 200, discount: 0, deliveryFee: 0, promoCode: "FREESHIP", items: [[5, "L", "Green", 1, 200]] },
    { id: 4, userId: 1000, status: "checkout", subtotal: 375, discount: 30, deliveryFee: 15, promoCode: "VIP30", items: [[11, "XL", "Blue", 3, 125]] },
    { id: 5, userId: 1001, status: "completed", subtotal: 316, discount: 50, deliveryFee: 15, promoCode: "HALFOFF", items: [[3, "S", "Green", 1, 180], [4, "S", "Blue", 1, 136]] },
    { id: 6, userId: 1001, status: "completed", subtotal: 270, discount: 0, deliveryFee: 15, items: [[7, "M", "Red", 2, 135]] },
    { id: 7, userId: 1001, status: "checkout", subtotal: 175, discount: 0, deliveryFee: 15, items: [[16, "M", "Blue", 1, 175]] },
    { id: 8, userId: 1002, status: "completed", subtotal: 300, discount: 0, deliveryFee: 0, items: [[30, "XL", "Green", 2, 150]] },
    { id: 9, userId: 1002, status: "completed", subtotal: 220, discount: 0, deliveryFee: 15, items: [[18, "L", "Green", 1, 220]] },
    { id: 10, userId: 1003, status: "completed", subtotal: 145, discount: 0, deliveryFee: 15, items: [[15, "S", "Green", 1, 145]] },
    { id: 11, userId: 1003, status: "completed", subtotal: 310, discount: 30, deliveryFee: 0, promoCode: "SAVE30", items: [[23, "S", "Red", 2, 155]] },
    { id: 12, userId: 1004, status: "completed", subtotal: 145, discount: 0, deliveryFee: 15, items: [[15, "L", "Green", 1, 145]] },
    { id: 13, userId: 1005, status: "completed", subtotal: 195, discount: 0, deliveryFee: 15, items: [[21, "S", "Blue", 1, 195]] },
    { id: 14, userId: 1007, status: "completed", subtotal: 185, discount: 0, deliveryFee: 15, items: [[20, "L", "Red", 1, 185]] },
];

let orderItemId = 1;

const mockOrders: Order[] = RAW_ORDERS.map((o) => ({
    id: o.id,
    userId: o.userId,
    status: o.status,
    subtotal: o.subtotal,
    discount: o.discount,
    deliveryFee: o.deliveryFee,
    total: o.subtotal - o.discount + o.deliveryFee,
    ...(o.promoCode ? { promoCode: o.promoCode } : {}),
    items: o.items.map(([productId, size, color, quantity, priceAtPurchase]) => {
        const product = mockProducts.find((p) => p.id === productId);
        return {
            id: orderItemId++,
            orderId: o.id,
            stockId: getStockId(productId, size, color),
            title: product?.title ?? "",
            image: product?.image,
            quantity,
            priceAtPurchase,
            totalPrice: priceAtPurchase * quantity,
        };
    }),
}));

export default mockOrders;

export const mockOrderItems = mockOrders.flatMap((order) => order.items);
