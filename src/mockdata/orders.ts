// src/mockdata/orders.ts

import { type OrderSummary } from "@/types";

const mockOrders: OrderSummary[] = [
    {
        id: "ord-01",
        userId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        status: "completed",
        items: [
            { productId: "t0001", title: "Owen Blue T-Shirt", image: "/images/t-shirt-1.webp", size: "L", color: "Blue", quantity: 2, unitPrice: 120, totalPrice: 240 }
        ],
        subtotal: 240,
        discount: 20,
        deliveryFee: 15,
        total: 235,
        promoCode: "SALE20"
    },
    {
        id: "ord-02",
        userId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        status: "completed",
        items: [
            { productId: "t0002", title: "Lyn White T-Shirt", image: "/images/t-shirt-2.webp", size: "M", color: "White", quantity: 1, unitPrice: 144, totalPrice: 144 }
        ],
        subtotal: 144,
        discount: 0,
        deliveryFee: 15,
        total: 159
    },
    {
        id: "ord-03",
        userId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        status: "completed",
        items: [
            { productId: "t0005", title: "Proclub White T-Shirt", image: "/images/t-shirt-5.webp", size: "L", color: "White", quantity: 1, unitPrice: 200, totalPrice: 200 }
        ],
        subtotal: 200,
        discount: 0,
        deliveryFee: 0,
        total: 200,
        promoCode: "FREESHIP"
    },
    {
        id: "ord-04",
        userId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        status: "checkout",
        items: [
            { productId: "t0011", title: "Classic Navy T-Shirt", image: "/images/t-shirt-3.webp", size: "XL", color: "Blue", quantity: 3, unitPrice: 125, totalPrice: 375 }
        ],
        subtotal: 375,
        discount: 30,
        deliveryFee: 15,
        total: 360,
        promoCode: "VIP30"
    },
    {
        id: "ord-05",
        userId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        status: "cart",
        items: [
            { productId: "t0025", title: "Simple Black T-Shirt", size: "M", color: "Black", quantity: 1, unitPrice: 140, totalPrice: 140 }
        ],
        subtotal: 140,
        discount: 0,
        deliveryFee: 15,
        total: 155
    },

    {
        id: "ord-06",
        userId: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
        status: "completed",
        items: [
            { productId: "t0003", title: "AC White T-Shirt", image: "/images/t-shirt-3.webp", size: "S", color: "White", quantity: 1, unitPrice: 180, totalPrice: 180 },
            { productId: "t0004", title: "SC Black T-Shirt", image: "/images/t-shirt-4.webp", size: "S", color: "Black", quantity: 1, unitPrice: 136, totalPrice: 136 }
        ],
        subtotal: 316,
        discount: 50,
        deliveryFee: 15,
        total: 281,
        promoCode: "HALFOFF"
    },
    {
        id: "ord-07",
        userId: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
        status: "completed",
        items: [
            { productId: "t0007", title: "Essential Gray T-Shirt", image: "/images/t-shirt-1.webp", size: "M", color: "Grey", quantity: 2, unitPrice: 135, totalPrice: 270 }
        ],
        subtotal: 270,
        discount: 0,
        deliveryFee: 15,
        total: 285
    },
    {
        id: "ord-08",
        userId: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
        status: "checkout",
        items: [
            { productId: "t0016", title: "Street Black T-Shirt", size: "M", color: "Black", quantity: 1, unitPrice: 175, totalPrice: 175 }
        ],
        subtotal: 175,
        discount: 0,
        deliveryFee: 15,
        total: 190
    },
    {
        id: "ord-09",
        userId: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
        status: "cart",
        items: [
            { productId: "t0020", title: "Modern Green T-Shirt", image: "/images/t-shirt-4.webp", size: "L", color: "Green", quantity: 1, unitPrice: 185, totalPrice: 185 }
        ],
        subtotal: 185,
        discount: 10,
        deliveryFee: 15,
        total: 190,
        promoCode: "NEW10"
    },

    {
        id: "ord-10",
        userId: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33",
        status: "completed",
        items: [
            { productId: "t0030", title: "Comfort Fit White T-Shirt", image: "/images/t-shirt-1.webp", size: "XL", color: "White", quantity: 2, unitPrice: 150, totalPrice: 300 }
        ],
        subtotal: 300,
        discount: 0,
        deliveryFee: 0,
        total: 300
    },
    {
        id: "ord-11",
        userId: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33",
        status: "completed",
        items: [
            { productId: "t0033", title: "Premium Cotton T-Shirt", image: "/images/t-shirt-3.webp", size: "L", color: "White", quantity: 1, unitPrice: 230, totalPrice: 230 }
        ],
        subtotal: 230,
        discount: 0,
        deliveryFee: 15,
        total: 245
    },
    {
        id: "ord-12",
        userId: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33",
        status: "cart",
        items: [
            { productId: "t0041", title: "Streetwear White T-Shirt", image: "/images/t-shirt-4.webp", size: "XL", color: "White", quantity: 1, unitPrice: 180, totalPrice: 180 }
        ],
        subtotal: 180,
        discount: 0,
        deliveryFee: 15,
        total: 195
    },

    {
        id: "ord-13",
        userId: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44",
        status: "completed",
        items: [
            { productId: "t0044", title: "Classic Cream T-Shirt", image: "/images/t-shirt-1.webp", size: "S", color: "White", quantity: 1, unitPrice: 145, totalPrice: 145 }
        ],
        subtotal: 145,
        discount: 0,
        deliveryFee: 15,
        total: 160
    },
    {
        id: "ord-14",
        userId: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44",
        status: "completed",
        items: [
            { productId: "t0047", title: "Classic Burgundy T-Shirt", image: "/images/t-shirt-3.webp", size: "S", color: "Red", quantity: 2, unitPrice: 155, totalPrice: 310 }
        ],
        subtotal: 310,
        discount: 30,
        deliveryFee: 0,
        total: 280,
        promoCode: "SAVE30"
    },
    {
        id: "ord-15",
        userId: "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44",
        status: "cart",
        items: [
            { productId: "t0050", title: "Essential Premium T-Shirt", image: "/images/t-shirt-5.webp", size: "M", color: "Black", quantity: 1, unitPrice: 205, totalPrice: 205 }
        ],
        subtotal: 205,
        discount: 0,
        deliveryFee: 15,
        total: 220
    },

    {
        id: "ord-16",
        userId: "e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55",
        status: "completed",
        items: [
            { productId: "t0015", title: "Soft Cotton White T-Shirt", image: "/images/t-shirt-1.webp", size: "L", color: "White", quantity: 1, unitPrice: 145, totalPrice: 145 }
        ],
        subtotal: 145,
        discount: 0,
        deliveryFee: 15,
        total: 160
    },
    {
        id: "ord-17",
        userId: "e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55",
        status: "cart",
        items: [
            { productId: "t0018", title: "Premium Blue T-Shirt", image: "/images/t-shirt-3.webp", size: "M", color: "Blue", quantity: 1, unitPrice: 220, totalPrice: 220 }
        ],
        subtotal: 220,
        discount: 0,
        deliveryFee: 15,
        total: 235
    },

    {
        id: "ord-18",
        userId: "f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66",
        status: "completed",
        items: [
            { productId: "t0021", title: "Heavy Cotton Black T-Shirt", image: "/images/t-shirt-5.webp", size: "S", color: "Black", quantity: 1, unitPrice: 195, totalPrice: 195 }
        ],
        subtotal: 195,
        discount: 0,
        deliveryFee: 15,
        total: 210
    },

    {
        id: "ord-19",
        userId: "11eebc99-9c0b-4ef8-bb6d-6bb9bd380a77",
        status: "cart",
        items: [
            { productId: "t0034", title: "Relaxed Navy T-Shirt", image: "/images/t-shirt-4.webp", size: "XXL", color: "Blue", quantity: 2, unitPrice: 165, totalPrice: 330 }
        ],
        subtotal: 330,
        discount: 30,
        deliveryFee: 0,
        total: 300,
        promoCode: "BULK30"
    },

    {
        id: "ord-20",
        userId: "22eebc99-9c0b-4ef8-bb6d-6bb9bd380a88",
        status: "completed",
        items: [
            { productId: "t0049", title: "Modern Oversized T-Shirt", image: "/images/t-shirt-4.webp", size: "L", color: "Grey", quantity: 1, unitPrice: 185, totalPrice: 185 }
        ],
        subtotal: 185,
        discount: 0,
        deliveryFee: 15,
        total: 200
    }
];

export default mockOrders;

export const mockOrderItems = mockOrders.flatMap(order => order.items);