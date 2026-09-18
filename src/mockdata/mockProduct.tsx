export interface Product{
    id: string;
    title: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    rating: number;
    imagePath: string;
}


export const mockProducts: Product[] = [
    {
        id: "t0001",
        title: "Owen Blue T-Shirt",
        price: 120,
        originalPrice: 126,
        discount: 5,
        rating: 4.5,
        imagePath: "/images/t-shirt-1.webp"
    },
    {
        id: "t0002",
        title: "Lyn White T-Shirt",
        price: 144,
        originalPrice: 169,
        discount: 15,
        rating: 3.5,
        imagePath: "/images/t-shirt-2.webp"
    },
    {
        id: "t0003",
        title: "AC White T-Shirt",
        price: 180,
        originalPrice: 200,
        discount: 10,
        rating: 4.3,
        imagePath: "/images/t-shirt-3.webp"
    },
    {
        id: "t0004",
        title: "SC Black T-Shirt",
        price: 136,
        originalPrice: 148,
        discount: 8,
        rating: 3,
        imagePath: "/images/t-shirt-4.webp"
    },
    {
        id: "t0005",
        title: "Proclub White T-Shirt",
        price: 200,
        originalPrice: 222,
        discount: 10,
        rating: 4.0,
        imagePath: "/images/t-shirt-5.webp"
    },
    {
        id: "t0006",
        title: "Classic Black T-Shirt",
        price: 150,
        rating: 4.2,
        imagePath: ""
    },
    {
        id: "t0007",
        title: "Essential Gray T-Shirt",
        price: 135,
        rating: 4.0,
        imagePath: ""
    },
    {
        id: "t0008",
        title: "Urban Green T-Shirt",
        price: 165,
        originalPrice: 183,
        discount: 10,
        rating: 4.4,
        imagePath: ""
    },
    {
        id: "t0009",
        title: "Relaxed Beige T-Shirt",
        price: 175,
        originalPrice: 206,
        discount: 15,
        rating: 4.6,
        imagePath: ""
    },
    {
        id: "t0010",
        title: "Minimal Gray T-Shirt",
        price: 190,
        originalPrice: 207,
        discount: 8,
        rating: 4.1,
        imagePath: ""
    },
];