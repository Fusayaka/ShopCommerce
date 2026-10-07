import { useEffect, useState } from 'react';
import './overview.css'
import { Link, useParams } from 'react-router-dom';
import { StarRating } from '@/components';
import plhImg from '/images/cloth-placeholder.jpeg'
import { CONFIG } from '@/config';
import type { Product } from '@/types';

export default function Overview() {
    const {productId} = useParams<{ productId: string }>();

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const [size, setSize] = useState<string | null>(null);
    const [color, setColor] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number | string>(1);

    // TODO: implement userId
    const userId = 1001;

    useEffect(() => {
        const controller = new AbortController();

        setIsLoading(true);
        setLoadError(null);
        setFeedback(null);

        const fetchProduct = async () => {
            if (!productId) return;

            try {
                const res = await fetch(`${CONFIG.API_URL}/products/${productId}`, {
                    signal: controller.signal
                });
                if (!res.ok) throw new Error(`Request failed: ${res.status}`);
                const data = await res.json();
                setProduct(data);
            }
            catch (error) {
                if (error instanceof Error && error.name === "AbortError") return;
                setLoadError("Could not load product.");
            }
            finally{
                setIsLoading(false);
            }
        }
        fetchProduct();
        return () => controller.abort();
    }, [productId])

    const handleQuantityChange = (type: 'increase' | 'decrease' | 'input', value? : string) => {
        const curQuantity = Number(quantity) || 0;
        
        if (type === 'decrease'){
            if (curQuantity >= 1){
                setQuantity(curQuantity - 1);
            }
            else {
                alert('Quantity must not be less than 0!');
                setQuantity(1);
            }
        }
        else if (type === 'increase'){
            setQuantity(curQuantity + 1);
        }
        else if (type === 'input' && value !== undefined) {
            if (value === ''){
                setQuantity('');
            }
            else {
                const num = parseInt(value, 10);
                if (!isNaN(num) && num >= 0){
                    setQuantity(num);
                }
            }
        }
    }

    const handleQuantityEmpty = () => {
        if (quantity === '' || Number(quantity) < 1) {
            setQuantity(1);
        }
    };

    useEffect(() => {
        if (!feedback) return;
        const timer = setTimeout(() => setFeedback(null), 3000);
        return () => clearTimeout(timer);
    }, [feedback]);

    const handleAddtoCart = async () => {
        if (!color || !size){
            setFeedback({ text: "Please choose size and color!", type: "error" });
            return;
        }

        try {
            const res = await fetch(`${CONFIG.API_URL}/carts/items?userId=${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: Number(productId),
                    size: size,
                    color: color,
                    quantity: Number(quantity),
                }),
            })
            if (!res.ok) throw new Error(`Request failed: ${res.status}`);
            setFeedback({ text: "Added to cart!", type: "success" });
        }
        catch {
            setFeedback({ text: "Could not add to your cart!", type: "error" });
        }
    };

    if (isLoading){
        return <div className="detail-status">Loading...</div>
    }

    if (loadError || !product){
        return (
            <div className="detail-status detail-status-error">
                {loadError ?? "Product not found."}
            </div>
        );
    }

    return (
        <section className='detail-container'>
            {feedback && (
                <div className={`detail-toast detail-toast-${feedback.type}`} role="status">
                    {feedback.text}
                </div>
            )}

            <nav className='detail-breadcrumb'>
                <Link to='/'>Home</Link> {' > '}
                <Link to='/products'>Product</Link> {' > '}
                <span className="detail-current-page">{product.title}</span>
            </nav>

            <div className='detail-main'>
                <div className='detail-image-wrapper'>
                    <img src={product.image || plhImg} alt={product.title} className='detail-main-img'/>
                </div>

                <div className='detail-info'>
                    <h1 className='detail-title'>
                        {product.title}
                    </h1>
                    
                    <div className='detail-rating-group'>
                        <span className="detail-stars">
                            <StarRating rating={product.rating}/>  
                        </span>
                        <span className="detail-score">{product.rating}/5</span>
                    </div>

                    <div className='detail-price-group'>
                        <span className='detail-current-price'>${product.promotionPrice ?? product.originalPrice}</span>

                        {product.promotionPrice && (
                            <span className='detail-original-price'>${product.originalPrice}</span>
                        )}

                        {product.discount && (
                            <span className='detail-discount-badge'>-{product.discount}%</span>
                        )}
                    </div>

                    <p className='detail-desc'>
                        {product.description}
                    </p>
                    
                    <div className="detail-selector-group">
                        <span className="detail-selector-label">Select colors</span>
                        <div className="detail-color-options">
                            {['Red', 'Blue', 'Green'].map(c => (
                                <button
                                    key={c}
                                    className={`detail-color-btn ${c.toLowerCase()} ${color === c ? 'active' : ''}`}
                                    onClick={() => setColor(c)}
                                ></button>
                            ))}
                        </div>
                    </div>

                    <hr className='detail-divider'/>

                    <div className="detail-selector-group">
                        <span className="detail-selector-label">Choose Size</span>
                        <div className="detail-size-options">
                            {['S', 'M', 'L', 'XL', 'XXL'].map(s => (
                                <button 
                                    key={s} 
                                    className={`detail-size-btn ${size === s ? 'active' : ''}`}
                                    onClick={() => setSize(s)}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <hr className="detail-divider" />

                    <div className="detail-action-group">
                        <div className="detail-quantity-selector">
                            <button onClick={() => handleQuantityChange('decrease')}>-</button>
                            <input 
                                type="text" 
                                className="detail-quantity-input" 
                                value={quantity} 
                                onChange={(e) => handleQuantityChange('input', e.target.value)}
                                onBlur={handleQuantityEmpty}
                            />
                            <button onClick={() => handleQuantityChange('increase')}>+</button>
                        </div>
                        <button className="detail-add-to-cart-btn" onClick={handleAddtoCart}>Add to Cart</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

