import { useEffect, useState } from 'react';
import './overview.css'
import { Link, useParams } from 'react-router-dom';
import { StarRating } from '@/components';
import plhImg from '/images/cloth-placeholder.jpeg'
import { CONFIG } from '@/config';
import type { Product } from '@/types';
import { getCardPrice } from '@/utils/pricing';

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
        setQuantity(1);
        return () => controller.abort();
    }, [productId])

    const handleQuantityChange = (type: 'increase' | 'decrease' | 'input', value? : string) => {
        const curQuantity = Number(quantity) || 0;
        
        if (type === 'decrease'){
            if (curQuantity > 1){
                setQuantity(curQuantity - 1);
            }
            else {
                setFeedback({ text: 'Quantity must not be less than 1!', type: "error" });
                setQuantity(1);
            }
        }
        else if (type === 'increase'){
            if (selectedStock != undefined && curQuantity >= selectedStock.stock){
                setFeedback({ text: "Can not buy more than stock inventory!", type: "error" });
                return;
            }
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

        const selectedStock = product?.stocks?.find(
            (s) => s.size === size && s.color === color,
        );
        if (!selectedStock){
            setFeedback({ text: "This option is not available!", type: "error" });
            return;
        }
        if (selectedStock.stock <= 0){
            setFeedback({ text: "This option is out of stock!", type: "error" });
            return;
        }

        try {
            const res = await fetch(`${CONFIG.API_URL}/carts/items?userId=${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    stockId: selectedStock.id,
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

    const rating = Number(product.rating);
    const selectedStock = product.stocks?.find(
        (s) => s.size === size && s.color === color,
    );
    const { originalPrice, promotionPrice, discount } = getCardPrice(
        product.stocks,
        size,
        color,
    );

    const stocks = product.stocks ?? [];
    const COLORS = ['Red', 'Blue', 'Green'];
    const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

    const colorExists = (c: string) =>
        stocks.some((v) => v.color === c);
    const variantExists = (c: string, s: string) =>
        stocks.some((v) => v.color === c && v.size === s);

    const outOfStock = !!selectedStock && selectedStock.stock <= 0;

    const handleSelectColor = (c: string) => {
        setColor(c);
        if (size && !variantExists(c, size)) setSize(null);
    };

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
                    
                    {rating > 0 && (
                        <div className='detail-rating-group'>
                            <span className="detail-stars">
                                <StarRating rating={rating}/>
                            </span>
                            <span className="detail-score">{rating}/5</span>
                        </div>
                    )}

                    <div className='detail-price-group'>
                        <span className='detail-current-price'>${promotionPrice ?? originalPrice}</span>

                        {promotionPrice != null && (
                            <span className='detail-original-price'>${originalPrice}</span>
                        )}

                        {discount ? (
                            <span className='detail-discount-badge'>-{discount}%</span>
                        ) : null}
                    </div>

                    <p className='detail-desc'>
                        {product.description}
                    </p>

                    <div className="detail-selector-group">
                        <span className="detail-selector-label">Select colors</span>
                        <div className="detail-color-options">
                            {COLORS.map(c => {
                                const disabled = !colorExists(c);
                                return (
                                    <button
                                        key={c}
                                        disabled={disabled}
                                        className={`detail-color-btn ${c.toLowerCase()} ${color === c ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
                                        onClick={() => {handleSelectColor(c), setQuantity(1)}}
                                    ></button>
                                );
                            })}
                        </div>
                    </div>

                    <hr className='detail-divider'/>

                    <div className="detail-selector-group">
                        <span className="detail-selector-label">Choose Size</span>
                        <div className="detail-size-options">
                            {SIZES.map(s => {
                                const disabled = !color || !variantExists(color, s);
                                return (
                                    <button
                                        key={s}
                                        disabled={disabled}
                                        className={`detail-size-btn ${size === s ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
                                        onClick={() => {setSize(s), setQuantity(1)}}
                                    >
                                        {s}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {selectedStock && (
                        outOfStock ? (
                            <p className="detail-stock-info detail-stock-out">Out of stock</p>
                        ) : (
                            <p className="detail-stock-info">In stock: {selectedStock.stock}</p>
                        )
                    )}

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
                        <button className="detail-add-to-cart-btn" onClick={handleAddtoCart} disabled={!selectedStock || outOfStock}>Add to Cart</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

