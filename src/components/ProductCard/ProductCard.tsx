import { Link } from "react-router-dom";
import './productcard.css'
import plhImg from '/images/cloth-placeholder.jpeg'
import StarRating from "../StarRating/StarRating";
import { getCardPrice } from "@/utils/pricing";
import type { Product } from "@/types";

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

function isNewProduct(createdAt?: string, updatedAt?: string): boolean {
    if (!createdAt) return true;
    const created = new Date(createdAt).getTime();
    if (Number.isNaN(created)) return true;
    const updated = updatedAt ? new Date(updatedAt).getTime() : created;
    return updated - created < THIRTY_DAYS;
}

export default function ProductCard(product: Product){
    const {originalPrice, promotionPrice, discount} = getCardPrice(product.stocks);
    const rating = Number(product.rating);
    const price = promotionPrice ?? originalPrice;
    const isNew = isNewProduct(product.createdAt, product.updatedAt);

    return (
        <Link to={`/product/${product.id}`}className="product-card">
            <div className="product-img-wrapper">
                <img src={product.image || plhImg} alt={product.title} loading="lazy"/>
            </div>

            <h4 className="product-title">{product.title}</h4>

            {rating > 0 ? (
                <div className="product-rating">
                    <span className="stars">
                        <StarRating rating={rating}/>
                    </span>
                    <span className="score">{rating}/5</span>
                </div>
            ) : isNew ? (
                <div className="product-rating">
                    <span className="new-badge">New</span>
                </div>
            ) : (
                <div className="product-rating">
                    <span className="no-review">No reviews</span>
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