import { type Product } from "@/types";


const mockProducts: Product[] = [
    {
        id: "t0001",
        title: "Owen Blue T-Shirt",
        price: 120,
        originalPrice: 126,
        discount: 5,
        rating: 4.5,
        image: "/images/t-shirt-1.webp"
    },
    {
        id: "t0002",
        title: "Lyn White T-Shirt",
        price: 144,
        originalPrice: 169,
        discount: 15,
        rating: 3.5,
        image: "/images/t-shirt-2.webp"
    },
    {
        id: "t0003",
        title: "AC White T-Shirt",
        price: 180,
        originalPrice: 200,
        discount: 10,
        rating: 4.3,
        image: "/images/t-shirt-3.webp"
    },
    {
        id: "t0004",
        title: "SC Black T-Shirt",
        price: 136,
        originalPrice: 148,
        discount: 8,
        rating: 3.0,
        image: "/images/t-shirt-4.webp"
    },
    {
        id: "t0005",
        title: "Proclub White T-Shirt",
        price: 200,
        originalPrice: 222,
        discount: 10,
        rating: 4.0,
        image: "/images/t-shirt-5.webp"
    },
    {
        id: "t0006",
        title: "Classic Black T-Shirt",
        price: 150,
        rating: 4.2,
        image: ""
    },
    {
        id: "t0007",
        title: "Essential Gray T-Shirt",
        price: 135,
        originalPrice: 150,
        rating: 4.0,
        image: "/images/t-shirt-1.webp"
    },
    {
        id: "t0008",
        title: "Urban Green T-Shirt",
        price: 165,
        originalPrice: 183,
        discount: 10,
        rating: 4.4,
        image: ""
    },
    {
        id: "t0009",
        title: "Relaxed Beige T-Shirt",
        price: 175,
        originalPrice: 206,
        discount: 15,
        rating: 4.6,
        image: "/images/t-shirt-2.webp"
    },
    {
        id: "t0010",
        title: "Minimal Gray T-Shirt",
        price: 190,
        rating: 4.1,
        image: ""
    },
    {
        id: "t0011",
        title: "Classic Navy T-Shirt",
        price: 125,
        originalPrice: 140,
        discount: 11,
        rating: 4.2,
        image: "/images/t-shirt-3.webp"
    },
    {
        id: "t0012",
        title: "Oversized White T-Shirt",
        price: 155,
        originalPrice: 180,
        discount: 14,
        rating: 4.5,
        image: "/images/t-shirt-4.webp"
    },
    {
        id: "t0013",
        title: "Essential Black T-Shirt",
        price: 130,
        rating: 3.8,
        image: ""
    },
    {
        id: "t0014",
        title: "Vintage Blue T-Shirt",
        price: 165,
        originalPrice: 190,
        discount: 13,
        rating: 4.3,
        image: "/images/t-shirt-5.webp"
    },
    {
        id: "t0015",
        title: "Soft Cotton White T-Shirt",
        price: 145,
        originalPrice: 160,
        rating: 4.1,
        image: "/images/t-shirt-1.webp"
    },
    {
        id: "t0016",
        title: "Street Black T-Shirt",
        price: 175,
        originalPrice: 200,
        discount: 12,
        rating: 4.4,
        image: ""
    },
    {
        id: "t0017",
        title: "Relax Fit Gray T-Shirt",
        price: 160,
        rating: 4.0,
        image: "/images/t-shirt-2.webp"
    },
    {
        id: "t0018",
        title: "Premium Blue T-Shirt",
        price: 220,
        originalPrice: 250,
        discount: 12,
        rating: 4.7,
        image: "/images/t-shirt-3.webp"
    },
    {
        id: "t0019",
        title: "Daily White T-Shirt",
        price: 110,
        rating: 3.9,
        image: ""
    },
    {
        id: "t0020",
        title: "Modern Green T-Shirt",
        price: 185,
        originalPrice: 210,
        discount: 12,
        rating: 4.5,
        image: "/images/t-shirt-4.webp"
    },
    {
        id: "t0021",
        title: "Heavy Cotton Black T-Shirt",
        price: 195,
        originalPrice: 220,
        discount: 11,
        rating: 4.6,
        image: "/images/t-shirt-5.webp"
    },
    {
        id: "t0022",
        title: "Basic Cream T-Shirt",
        price: 125,
        rating: 4.0,
        image: ""
    },
    {
        id: "t0023",
        title: "Sporty Blue T-Shirt",
        price: 155,
        originalPrice: 175,
        discount: 11,
        rating: 4.2,
        image: "/images/t-shirt-1.webp"
    },
    {
        id: "t0024",
        title: "Loose Fit White T-Shirt",
        price: 170,
        originalPrice: 195,
        discount: 13,
        rating: 4.3,
        image: "/images/t-shirt-2.webp"
    },
    {
        id: "t0025",
        title: "Simple Black T-Shirt",
        price: 140,
        rating: 3.7,
        image: ""
    },
    {
        id: "t0026",
        title: "Classic Olive T-Shirt",
        price: 180,
        originalPrice: 205,
        discount: 12,
        rating: 4.4,
        image: "/images/t-shirt-3.webp"
    },
    {
        id: "t0027",
        title: "Premium Gray T-Shirt",
        price: 210,
        originalPrice: 240,
        discount: 13,
        rating: 4.8,
        image: "/images/t-shirt-4.webp"
    },
    {
        id: "t0028",
        title: "Everyday Beige T-Shirt",
        price: 135,
        originalPrice: 150,
        rating: 4.1,
        image: ""
    },
    {
        id: "t0029",
        title: "Urban Navy T-Shirt",
        price: 165,
        originalPrice: 185,
        discount: 11,
        rating: 4.5,
        image: "/images/t-shirt-5.webp"
    },
    {
        id: "t0030",
        title: "Comfort Fit White T-Shirt",
        price: 150,
        originalPrice: 175,
        discount: 14,
        rating: 4.2,
        image: "/images/t-shirt-1.webp"
    },
    {
        id: "t0031",
        title: "Modern Black T-Shirt",
        price: 155,
        rating: 4.0,
        image: "/images/t-shirt-2.webp"
    },
    {
        id: "t0032",
        title: "Classic Red T-Shirt",
        price: 145,
        originalPrice: 170,
        discount: 15,
        rating: 4.3,
        image: ""
    },
    {
        id: "t0033",
        title: "Premium Cotton T-Shirt",
        price: 230,
        originalPrice: 260,
        discount: 12,
        rating: 4.7,
        image: "/images/t-shirt-3.webp"
    },
    {
        id: "t0034",
        title: "Relaxed Navy T-Shirt",
        price: 165,
        originalPrice: 180,
        rating: 4.1,
        image: "/images/t-shirt-4.webp"
    },
    {
        id: "t0035",
        title: "Urban White T-Shirt",
        price: 135,
        rating: 3.9,
        image: ""
    },
    {
        id: "t0036",
        title: "Everyday Blue T-Shirt",
        price: 125,
        originalPrice: 145,
        discount: 14,
        rating: 4.2,
        image: "/images/t-shirt-5.webp"
    },
    {
        id: "t0037",
        title: "Heavyweight Gray T-Shirt",
        price: 195,
        originalPrice: 225,
        discount: 13,
        rating: 4.6,
        image: "/images/t-shirt-1.webp"
    },
    {
        id: "t0038",
        title: "Minimal Black T-Shirt",
        price: 150,
        rating: 4.0,
        image: "/images/t-shirt-2.webp"
    },
    {
        id: "t0039",
        title: "Soft Beige T-Shirt",
        price: 140,
        originalPrice: 155,
        rating: 4.3,
        image: ""
    },
    {
        id: "t0040",
        title: "Classic Green T-Shirt",
        price: 160,
        originalPrice: 185,
        discount: 14,
        rating: 4.4,
        image: "/images/t-shirt-3.webp"
    },
    {
        id: "t0041",
        title: "Streetwear White T-Shirt",
        price: 180,
        originalPrice: 210,
        discount: 14,
        rating: 4.5,
        image: "/images/t-shirt-4.webp"
    },
    {
        id: "t0042",
        title: "Basic Navy T-Shirt",
        price: 120,
        rating: 3.8,
        image: ""
    },
    {
        id: "t0043",
        title: "Premium Black T-Shirt",
        price: 215,
        originalPrice: 245,
        discount: 12,
        rating: 4.8,
        image: "/images/t-shirt-5.webp"
    },
    {
        id: "t0044",
        title: "Classic Cream T-Shirt",
        price: 145,
        originalPrice: 165,
        rating: 4.2,
        image: "/images/t-shirt-1.webp"
    },
    {
        id: "t0045",
        title: "Casual Gray T-Shirt",
        price: 135,
        rating: 4.0,
        image: "/images/t-shirt-2.webp"
    },
    {
        id: "t0046",
        title: "Oversized Green T-Shirt",
        price: 175,
        originalPrice: 200,
        discount: 13,
        rating: 4.5,
        image: ""
    },
    {
        id: "t0047",
        title: "Classic Burgundy T-Shirt",
        price: 155,
        originalPrice: 175,
        discount: 11,
        rating: 4.1,
        image: "/images/t-shirt-3.webp"
    },
    {
        id: "t0048",
        title: "Daily Cotton T-Shirt",
        price: 115,
        rating: 3.9,
        image: ""
    },
    {
        id: "t0049",
        title: "Modern Oversized T-Shirt",
        price: 185,
        originalPrice: 215,
        discount: 14,
        rating: 4.6,
        image: "/images/t-shirt-4.webp"
    },
    {
        id: "t0050",
        title: "Essential Premium T-Shirt",
        price: 205,
        originalPrice: 230,
        discount: 11,
        rating: 4.7,
        image: "/images/t-shirt-5.webp"
    }
];


export default mockProducts;