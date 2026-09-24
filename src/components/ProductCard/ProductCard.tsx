import { Link } from "react-router-dom";
import './productcard.css'
import plhImg from '/images/cloth-placeholder.jpeg'
import StarRating from "../StarRating/StarRating";

interface ProductCardProps {
    id: string | number;
    image?: string;
    title: string;
    rating: number;
    price: number;
    originalPrice?: number;
    discount?: number;
}

export default function ProductCard({
    id,
    image, 
    title, 
    rating,
    price, 
    originalPrice, 
    discount
}: ProductCardProps){
    return (
        <Link to={`/product/${id}`}className="product-card">
            <div className="product-img-wrapper">
                <img src={image || plhImg} alt={title} loading="lazy"/>
            </div>

            <h4 className="product-title">{title}</h4>

            <div className="product-rating">
                <span className="stars">
                    <StarRating rating={rating}/>   
                </span> 
                <span className="score">{rating}/5</span>
            </div>

            <div className="product-price">
                <span className="cur-price">${price}</span>
                {(originalPrice || discount) && (
                    <div className="price-group">
                        {originalPrice && <span className="ori-price">${originalPrice}</span>}
                        {discount && <span className="discount-badge">-{discount}%</span>}
                    </div>
                )}
            </div>
        </Link>
    );
}