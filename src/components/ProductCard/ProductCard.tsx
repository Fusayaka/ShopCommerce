import { Link } from "react-router-dom";
import './productcard.css'
import plhImg from '/images/cloth-placeholder.jpeg'
import StarRating from "../StarRating/StarRating";
import { getCardPrice } from "@/utils/pricing";
import type { Product } from "@/types";

export default function ProductCard(product: Product){
    const {originalPrice, promotionPrice, discount} = getCardPrice(product.stocks);
    const rating = Number(product.rating);
    const price = promotionPrice ?? originalPrice;

    return (
        <Link to={`/product/${product.id}`}className="product-card">
            <div className="product-img-wrapper">
                <img src={product.image || plhImg} alt={product.title} loading="lazy"/>
            </div>

            <h4 className="product-title">{product.title}</h4>

            {rating > 0 && (
                <div className="product-rating">
                    <span className="stars">
                        <StarRating rating={rating}/>
                    </span>
                    <span className="score">{rating}/5</span>
                </div>
            )}

            <div className="product-price">
                <span className="cur-price">${price}</span>
                {promotionPrice != null && (
                    <div className="price-group">
                        <span className="ori-price">${originalPrice}</span>
                        {discount ? <span className="discount-badge">-{discount}%</span> : null}
                    </div>
                )}
            </div>
        </Link>
    );
}