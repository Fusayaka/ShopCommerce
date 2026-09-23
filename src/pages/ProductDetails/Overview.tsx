import { useEffect, useState } from 'react';
import './overview.css'
import { Link, useParams } from 'react-router-dom';
import fullStar from '@/assets/fullstar.png'
import halfStar from '@/assets/halfstar.png'
import plhImg from '/images/cloth-placeholder.jpeg'
import { mockProducts, type Product } from '@/mockdata/mockProduct';

const DEFAULT_DESC = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam, ea saepe aliquam expedita cum a commodi, aliquid autem laborum recusandae nulla sequi culpa tempore repellendus qui ad ratione, ipsam iure.";

const StarRating = ({rating} : {rating: number}) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars.push(
                <img key={i} src={fullStar} alt="star" className="star-icon" />
            );
        } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
            stars.push(
                <img key={i} src={halfStar} alt="half star" className="star-icon" />
            );
        } else {
            stars.push(
                <img key={i} src={fullStar} alt="empty star" className="star-icon empty-star" />
            );
        }
    }
    
    return <>{stars}</>;
}

export default function Overview() {
    const {productId} = useParams<{ productId: string }>();

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [size, setSize] = useState<string>("S");
    const [color, setColor] = useState<string>("Red");
    const [quantity, setQuantity] = useState<number | string>(1);

    useEffect(() => {
        setIsLoading(true);

        const timeout = setTimeout(() => {
            const product = mockProducts.find(p => p.id === productId);
            setProduct(product || null);
            setIsLoading(false);
        }, 500);
        
        return () => clearTimeout(timeout);

        // const fetchProductAPI = async () => {
        //     if (!productId) return;

        //     try {
        //         const response = await fetch(PRODUCT_API);
        //         if (!response.ok) throw new Error('Not Found');
        //         const data = await response.json();
        //         setProduct(data);
        //     }
        //     catch (error) {
        //         console.log(error);
        //     }
        //     finally{
        //         setIsLoading(false);
        //     }
        // }
        // fetchProductAPI();


    }, [productId])

    const handleQuantityChange = (type: 'increase' | 'decrease' | 'input', value? : string) => {
        const curQuantity = Number(quantity) || 0;
        
        if (type === 'decrease'){
            if (curQuantity >= 1){
                setQuantity(curQuantity - 1);
            }
            else {
                alert('Quantity must not be less than 0!');
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

    if (isLoading || !product){
        return <div className="overview-container">Loading</div>
    }

    return (
        <section className='detail-container'>
            <nav className='detail-breadcrumb'>
                <Link to='/'>Home</Link> {' > '}
                <Link to='/product'>Product</Link> {' > '}
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
                        <span className='detail-current-price'>${product.price}</span>
                        
                        {product.originalPrice && (
                            <span className='detail-original-price'>${product.originalPrice}</span>
                        )}
                        
                        {product.discount && (
                            <span className='detail-discount-badge'>-{product.discount}%</span>
                        )}
                    </div>

                    <p className='detail-desc'>
                        {product.desc || DEFAULT_DESC}
                    </p>
                    
                    <div className="detail-selector-group">
                        <span className="detail-selector-label">Select colors</span>
                        <div className="detail-color-options">
                            {['red', 'blue', 'green'].map(c => (
                                <button 
                                    key={c}
                                    className={`detail-color-btn ${c} ${color === c ? 'active' : ''}`} 
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
                        <button className="detail-add-to-cart-btn">Add to Cart</button>
                    </div>
                </div>
            </div>
        </section>
    );
}