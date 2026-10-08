// src/mockdata/products.ts
// Mirrors the `products` seed. Prices now live on product variants (productStocks).

export interface Product {
    id: number;
    title: string;
    description?: string;
    rating: number;
    numReviews: number;
    image?: string;
}

const mockProducts: Product[] = [
    { id: 1, title: "Owen Blue T-Shirt", rating: 4.0, numReviews: 214, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80" },
    { id: 2, title: "Lyn White T-Shirt", rating: 4.7, numReviews: 98, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80" },
    { id: 3, title: "AC White T-Shirt", rating: 2.8, numReviews: 176, image: "https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=600&q=80" },
    { id: 4, title: "SC Black T-Shirt", rating: 5.0, numReviews: 54, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80" },
    { id: 5, title: "Proclub White T-Shirt", rating: 3.8, numReviews: 132, image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80" },
    { id: 6, title: "Classic Black T-Shirt", rating: 4.4, numReviews: 143, image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80" },
    { id: 7, title: "Essential Gray T-Shirt", rating: 4.8, numReviews: 87, image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80" },
    { id: 8, title: "Urban Green T-Shirt", rating: 3.4, numReviews: 165, image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80" },
    { id: 9, title: "Relaxed Beige T-Shirt", rating: 1.6, numReviews: 231, image: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&q=80" },
    { id: 10, title: "Minimal Gray T-Shirt", rating: 4.5, numReviews: 76, image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80" },
    { id: 11, title: "Classic Navy T-Shirt", rating: 4.1, numReviews: 119, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80" },
    { id: 12, title: "Oversized White T-Shirt", rating: 3.1, numReviews: 188, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80" },
    { id: 13, title: "Essential Black T-Shirt", rating: 4.9, numReviews: 63, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80" },
    { id: 14, title: "Vintage Blue T-Shirt", rating: 3.6, numReviews: 147, image: "https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=600&q=80" },
    { id: 15, title: "Soft Cotton White T-Shirt", rating: 4.3, numReviews: 102, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80" },
    { id: 16, title: "Street Black T-Shirt", rating: 2.4, numReviews: 159, image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80" },
    { id: 17, title: "Relax Fit Gray T-Shirt", rating: 4.6, numReviews: 91, image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80" },
    { id: 18, title: "Premium Blue T-Shirt", rating: 1.0, numReviews: 276, image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80" },
    { id: 19, title: "Daily White T-Shirt", rating: 4.5, numReviews: 48, image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80" },
    { id: 20, title: "Modern Green T-Shirt", rating: 2.1, numReviews: 203, image: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&q=80" },
    { id: 21, title: "Heavy Cotton Black T-Shirt", rating: 1.9, numReviews: 221, image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80" },
    { id: 22, title: "Basic Cream T-Shirt", rating: 4.2, numReviews: 72, image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80" },
    { id: 23, title: "Sporty Blue T-Shirt", rating: 3.7, numReviews: 134, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80" },
    { id: 24, title: "Loose Fit White T-Shirt", rating: 3.3, numReviews: 151, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80" },
    { id: 25, title: "Simple Black T-Shirt", rating: 4.0, numReviews: 39, image: "https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=600&q=80" },
    { id: 26, title: "Classic Olive T-Shirt", rating: 2.6, numReviews: 168, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80" },
    { id: 27, title: "Premium Gray T-Shirt", rating: 1.3, numReviews: 312, image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80" },
    { id: 28, title: "Everyday Beige T-Shirt", rating: 3.9, numReviews: 84, image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80" },
    { id: 29, title: "Urban Navy T-Shirt", rating: 3.0, numReviews: 192, image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80" },
    { id: 30, title: "Comfort Fit White T-Shirt", rating: 3.5, numReviews: 127, image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80" },
];

export default mockProducts;
