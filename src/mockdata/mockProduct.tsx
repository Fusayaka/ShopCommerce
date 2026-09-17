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
        discount: 5,
        rating: 4.5,
        imagePath: "/images/t-shirt-1.webp"
    },
    {
        id: "t0002",
        title: "Lyn White T-Shirt",
        price: 144,
        discount: 15,
        rating: 3.5,
        imagePath: "/images/t-shirt-2.webp"
    },
    {
        id: "t0003",
        title: "AC White T-Shirt",
        price: 180,
        discount: 10,
        rating: 4.3,
        imagePath: "/images/t-shirt-3.webp"
    },
    {
        id: "t0004",
        title: "SC Black T-Shirt",
        price: 136,
        discount: 8,
        rating: 4.5,
        imagePath: "/images/t-shirt-4.webp"
    },
    {
        id: "t0005",
        title: "Proclub White T-Shirt",
        price: 200,
        discount: 10,
        rating: 4.0,
        imagePath: "/images/t-shirt-5.webp"
    },
]