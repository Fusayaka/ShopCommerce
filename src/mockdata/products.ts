import { type Product } from "@/types";


const mockProducts: Product[] = [
    {
        id: "t0001",
        title: "Owen Blue T-Shirt",
        originalPrice: 126,
        promotionPrice: 120,
        discount: 5,
        rating: 4.5,
        numReviews: 214,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80"
    },
    {
        id: "t0002",
        title: "Lyn White T-Shirt",
        originalPrice: 169,
        promotionPrice: 144,
        discount: 15,
        rating: 3.5,
        numReviews: 98,
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80"
    },
    {
        id: "t0003",
        title: "AC White T-Shirt",
        originalPrice: 200,
        promotionPrice: 180,
        discount: 10,
        rating: 4.3,
        numReviews: 176,
        image: "https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=600&q=80"
    },
    {
        id: "t0004",
        title: "SC Black T-Shirt",
        originalPrice: 148,
        promotionPrice: 136,
        discount: 8,
        rating: 3.0,
        numReviews: 54,
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80"
    },
    {
        id: "t0005",
        title: "Proclub White T-Shirt",
        originalPrice: 222,
        promotionPrice: 200,
        discount: 10,
        rating: 4.0,
        numReviews: 132,
        image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80"
    },
    {
        id: "t0006",
        title: "Classic Black T-Shirt",
        originalPrice: 150,
        rating: 4.2,
        numReviews: 143,
        image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80"
    },
    {
        id: "t0007",
        title: "Essential Gray T-Shirt",
        originalPrice: 135,
        rating: 4.0,
        numReviews: 87,
        image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80"
    },
    {
        id: "t0008",
        title: "Urban Green T-Shirt",
        originalPrice: 183,
        promotionPrice: 165,
        discount: 10,
        rating: 4.4,
        numReviews: 165,
        image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80"
    },
    {
        id: "t0009",
        title: "Relaxed Beige T-Shirt",
        originalPrice: 206,
        promotionPrice: 175,
        discount: 15,
        rating: 4.6,
        numReviews: 231,
        image: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&q=80"
    },
    {
        id: "t0010",
        title: "Minimal Gray T-Shirt",
        originalPrice: 190,
        rating: 4.1,
        numReviews: 76,
        image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80"
    },
    {
        id: "t0011",
        title: "Classic Navy T-Shirt",
        originalPrice: 140,
        promotionPrice: 125,
        discount: 11,
        rating: 4.2,
        numReviews: 119,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80"
    },
    {
        id: "t0012",
        title: "Oversized White T-Shirt",
        originalPrice: 180,
        promotionPrice: 155,
        discount: 14,
        rating: 4.5,
        numReviews: 188,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80"
    },
    {
        id: "t0013",
        title: "Essential Black T-Shirt",
        originalPrice: 130,
        rating: 3.8,
        numReviews: 63,
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80"
    },
    {
        id: "t0014",
        title: "Vintage Blue T-Shirt",
        originalPrice: 190,
        promotionPrice: 165,
        discount: 13,
        rating: 4.3,
        numReviews: 147,
        image: "https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=600&q=80"
    },
    {
        id: "t0015",
        title: "Soft Cotton White T-Shirt",
        originalPrice: 145,
        rating: 4.1,
        numReviews: 102,
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80"
    },
    {
        id: "t0016",
        title: "Street Black T-Shirt",
        originalPrice: 200,
        promotionPrice: 175,
        discount: 13,
        rating: 4.4,
        numReviews: 159,
        image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80"
    },
    {
        id: "t0017",
        title: "Relax Fit Gray T-Shirt",
        originalPrice: 160,
        rating: 4.0,
        numReviews: 91,
        image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80"
    },
    {
        id: "t0018",
        title: "Premium Blue T-Shirt",
        originalPrice: 250,
        promotionPrice: 220,
        discount: 12,
        rating: 4.7,
        numReviews: 276,
        image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80"
    },
    {
        id: "t0019",
        title: "Daily White T-Shirt",
        originalPrice: 110,
        rating: 3.9,
        numReviews: 48,
        image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80"
    },
    {
        id: "t0020",
        title: "Modern Green T-Shirt",
        originalPrice: 210,
        promotionPrice: 185,
        discount: 12,
        rating: 4.5,
        numReviews: 203,
        image: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&q=80"
    },
    {
        id: "t0021",
        title: "Heavy Cotton Black T-Shirt",
        originalPrice: 220,
        promotionPrice: 195,
        discount: 11,
        rating: 4.6,
        numReviews: 221,
        image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80"
    },
    {
        id: "t0022",
        title: "Basic Cream T-Shirt",
        originalPrice: 125,
        rating: 4.0,
        numReviews: 72,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80"
    },
    {
        id: "t0023",
        title: "Sporty Blue T-Shirt",
        originalPrice: 175,
        promotionPrice: 155,
        discount: 11,
        rating: 4.2,
        numReviews: 134,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80"
    },
    {
        id: "t0024",
        title: "Loose Fit White T-Shirt",
        originalPrice: 195,
        promotionPrice: 170,
        discount: 13,
        rating: 4.3,
        numReviews: 151,
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80"
    },
    {
        id: "t0025",
        title: "Simple Black T-Shirt",
        originalPrice: 140,
        rating: 3.7,
        numReviews: 39,
        image: "https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=600&q=80"
    },
    {
        id: "t0026",
        title: "Classic Olive T-Shirt",
        originalPrice: 205,
        promotionPrice: 180,
        discount: 12,
        rating: 4.4,
        numReviews: 168,
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80"
    },
    {
        id: "t0027",
        title: "Premium Gray T-Shirt",
        originalPrice: 240,
        promotionPrice: 210,
        discount: 13,
        rating: 4.8,
        numReviews: 312,
        image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80"
    },
    {
        id: "t0028",
        title: "Everyday Beige T-Shirt",
        originalPrice: 135,
        rating: 4.1,
        numReviews: 84,
        image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80"
    },
    {
        id: "t0029",
        title: "Urban Navy T-Shirt",
        originalPrice: 185,
        promotionPrice: 165,
        discount: 11,
        rating: 4.5,
        numReviews: 192,
        image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80"
    },
    {
        id: "t0030",
        title: "Comfort Fit White T-Shirt",
        originalPrice: 175,
        promotionPrice: 150,
        discount: 14,
        rating: 4.2,
        numReviews: 127,
        image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80"
    }
];


export default mockProducts;
