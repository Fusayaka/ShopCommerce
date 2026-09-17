export interface Product{
    id: string;
    name: string;
    price: number;
    discount?: number;
    rating: number;
    imagePath: string;
}


export const mockProducts: Product[] = [
    {
        id: "t0001",
        name: "Owen Blue T-Shirt",
        price: 120,
        discount: 5,
        rating: 4.5,
        imagePath: "/images/t-shirt-1.webp"
    },
    {
        id: "t0002",
        name: "Lyn White T-Shirt",
        price: 144,
        discount: 15,
        rating: 3.5,
        imagePath: "/images/t-shirt-2.webp"
    },
    {
        id: "t0001",
        name: "AC White T-Shirt",
        price: 180,
        discount: 10,
        rating: 4.3,
        imagePath: "/images/t-shirt-3.webp"
    },
    {
        id: "t0004",
        name: "SC Black T-Shirt",
        price: 136,
        discount: 8,
        rating: 4.5,
        imagePath: "/images/t-shirt-4.webp"
    },
    {
        id: "t0005",
        name: "Proclub White T-Shirt",
        price: 200,
        discount: 10,
        rating: 4.0,
        imagePath: "/images/t-shirt-5.webp"
    },
]