import { useEffect, useState } from 'react';
import './overview.css'
import { Link, useParams } from 'react-router-dom';
import { StarRating } from '@/components';
import plhImg from '/images/cloth-placeholder.jpeg'
import type { Product } from '@/types';
import { getCardPrice } from '@/utils/pricing';
import { cartApi } from '@/api/cartApi';
import { productApi } from '@/api/productApi';
import { toast } from 'react-toastify';

export default function Overview() {
    const {productId} = useParams<{ productId: string }>();

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    const [size, setSize] = useState<string | null>(null);
    const [color, setColor] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number | string>(1);

    // TODO: implement userId
    const userId = 1001;

    useEffect(() => {
        let active = true;

        setIsLoading(true);
        setLoadError(null);

        const fetchProduct = async () => {
            if (!productId) return;

            try {
                const data = await productApi.getProduct(Number(productId));
                if (!active) return;
                setProduct(data);
            }
            catch {
                if (!active) return;
                setLoadError("Could not load product.");
            }
            finally{
                if (active) setIsLoading(false);
            }
        }
        fetchProduct();
        setQuantity(1);
        return () => { active = false; };
    }, [productId])

    const handleQuantityChange = (type: 'increase' | 'decrease' | 'input', value? : string) => {
        const curQuantity = Number(quantity) || 0;
        
        if (type === 'decrease'){
            if (curQuantity > 1){
                setQuantity(curQuantity - 1);
            }
            else {
                toast.error("Quantity must not be less than 1!");
                setQuantity(1);
            }
        }
        else if (type === 'increase'){
            if (selectedStock != undefined && curQuantity >= selectedStock.stock){
                toast.error("Can not buy more than stock inventory!");
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

    const handleAddtoCart = async () => {
        if (!color || !size){
            toast.error("Please choose size and color!");
            return;
        }

        const selectedStock = product?.stocks?.find(
            (s) => s.size === size && s.color === color,
        );
        if (!selectedStock){
            toast.error("This option is not available!");
            return;
        }
        if (selectedStock.stock <= 0){
            toast.error("This option is out of stock!");
            return;
        }

        try {
            await cartApi.addToCart(userId, {
                stockId: selectedStock.id,
                quantity: Number(quantity),
            });
            toast.success("Added to cart!");
        }
        catch {
            toast.error("Could not add to your cart!");
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

