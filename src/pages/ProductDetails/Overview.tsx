import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { StarRating } from '@/components';
import plhImg from '/images/cloth-placeholder.jpeg'
import type { Product } from '@/types';
import { getCardPrice } from '@/utils/pricing';
import { cartApi } from '@/api/cartApi';
import { notifyCartChanged } from '@/utils/cartCount';
import { productApi } from '@/api/productApi';
import { toast } from 'react-toastify';
import { useAuth } from '@/utils/auth';
import { ConfirmModal } from '@/components';
import { SIZES, COLORS } from '@/constants/catalog';
import { ROUTES } from '@/constants/routes';

export default function Overview() {
    const {productId} = useParams<{ productId: string }>();
    const navigate = useNavigate();

    const { loggedIn, user } = useAuth();
    const [pendingAction, setPendingAction] = useState<'cart' | 'buy' | null>(null);

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    const [size, setSize] = useState<string | null>(null);
    const [color, setColor] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number | string>(1);


    useEffect(() => {
        let active = true;

        const fetchProduct = async () => {
            if (!productId) return;

            setIsLoading(true);
            setLoadError(null);
            setQuantity(1);

            try {
                const data = await productApi.getProduct(Number(productId));
                if (!active) return;
                setProduct(data);

                const stocks = data.stocks ?? [];
                const firstColor = COLORS.find((c) => stocks.some((v) => v.color === c)) ?? null;
                const firstSize = firstColor
                    ? SIZES.find((s) => stocks.some((v) => v.color === firstColor && v.size === s)) ?? null
                    : null;
                setColor(firstColor);
                setSize(firstSize);
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

    const addSelectionToCart = async (): Promise<boolean> => {
        if (!user) {
            toast.error("Please log in to add items to your cart.");
            navigate(ROUTES.LOGIN);
            return false;
        }

        if (!color || !size){
            toast.error("Please choose size and color!");
            return false;
        }

        const selectedStock = product?.stocks?.find(
            (s) => s.size === size && s.color === color,
        );
        if (!selectedStock){
            toast.error("This option is not available!");
            return false;
        }
        if (selectedStock.stock <= 0){
            toast.error("This option is out of stock!");
            return false;
        }

        try {
            await cartApi.addToCart({
                stockId: selectedStock.id,
                quantity: Number(quantity),
            });
            notifyCartChanged();
            return true;
        }
        catch {
            toast.error("Could not add to your cart!");
            return false;
        }
    };
    
    const buyProducts = async (): Promise<boolean> => {
        const added = await addSelectionToCart();
        return added;
    }

    const executeAddtoCart = async () => {
        const added = await addSelectionToCart();
        if (added) toast.success("Added to cart!");
    };

    const executeBuyNow = async () => {
        const added = await buyProducts();
        if (added) {
            navigate(ROUTES.CHECKOUT);
        }
    };

    const handleAddtoCart = async () => {
        if (!loggedIn){
            setPendingAction('cart');
            return;
        }
        await executeAddtoCart();
    }

    const handleBuyNow = async () => {
        if (!loggedIn){
            setPendingAction('buy');
            return;
        }
        executeBuyNow();
    }

    const handleConfirmLogin = () => {
        const isBuyNow = pendingAction === 'buy';
        setPendingAction(null);

        navigate(ROUTES.LOGIN, {
            state: { 
                from: isBuyNow ? '/checkout' : location.pathname 
            }
        });
    };

    const statusCls = "mx-auto max-w-[1200px] px-[5%] py-[60px] text-center text-base text-[#666]";

    if (isLoading){
        return <div className={statusCls}>Loading...</div>
    }

    if (loadError || !product){
        return (
            <div className={`${statusCls} text-[#ff3333]`}>
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

    const colorExists = (c: string) =>
        stocks.some((v) => v.color === c);
    const variantExists = (c: string, s: string) =>
        stocks.some((v) => v.color === c && v.size === s);

    const availableColors = COLORS.filter(colorExists);

    const outOfStock = !!selectedStock && selectedStock.stock <= 0;

    const handleSelectColor = (c: string) => {
        setColor(c);
        if (!size || !variantExists(c, size)) {
            setSize(SIZES.find((s) => variantExists(c, s)) ?? null);
        }
    };

    const COLOR_BG: Record<string, string> = {
        red: 'bg-[#f84c4c]',
        blue: 'bg-[#3b5998]',
        green: 'bg-[#55c855]',
    };
    const divider = "my-[15px] border-none border-t-0 max-md:border-t max-md:border-[#e5e5e5]";
    const selectorLabel = "mb-4 block font-bold text-[#666]";
    const priceBig = "text-[51px] font-bold max-md:text-[28px]";

    return (
            <section className='px-[5%] py-6 text-left text-black max-md:px-[30px] max-md:pt-5 max-md:pb-0'>
                <nav className='mb-6 text-sm text-[#666] [&_a]:text-[#666] [&_a]:no-underline [&_a]:transition-colors [&_a:hover]:text-black [&_a:hover]:underline'>
                    <Link to={ROUTES.HOME}>Home</Link> {' > '}
                    <Link to={ROUTES.PRODUCTS}>Product</Link> {' > '}
                    <span className="font-medium text-black">{product.title}</span>
                </nav>

                <div className='flex items-start gap-10 max-md:flex-col max-md:gap-6'>
                    <div className='flex aspect-[3/4] shrink-0 grow-0 basis-[35%] items-center justify-center overflow-hidden rounded-[20px] bg-[#f2f0f1] max-md:mx-auto max-md:aspect-square max-md:w-4/5 max-md:basis-auto'>
                        <img src={product.image || plhImg} alt={product.title} className='block h-full w-full object-cover'/>
                    </div>

                    <div className='flex flex-1 flex-col text-left max-md:p-[5%]'>
                        <h1 className='m-0 mb-3 pb-1 text-[32px] font-black tracking-[1px] uppercase max-md:text-left max-md:text-[21px]'>
                            {product.title}
                        </h1>

                        {rating > 0 && (
                            <div className='mb-4 flex items-center justify-start gap-3 text-sm max-md:mb-2.5'>
                                <span className="flex items-center gap-1">
                                    <StarRating rating={rating}/>
                                </span>
                                <span className="font-semibold text-[#666]">{rating}/5</span>
                            </div>
                        )}

                        <div className='my-4 flex w-full items-center justify-start gap-4'>
                            <span className={`${priceBig} text-left`}>${promotionPrice ?? originalPrice}</span>

                            {promotionPrice != null && (
                                <span className={`${priceBig} text-[#0000004d] line-through`}>${originalPrice}</span>
                            )}

                            {discount ? (
                                <span className='rounded-[42px] bg-[#ff33331a] px-3.5 py-0 text-xl font-medium text-[#ff3333]'>-{discount}%</span>
                            ) : null}
                        </div>

                        <p className='mb-6 text-base leading-[1.6] text-[#666] max-md:font-medium'>
                            {product.description}
                        </p>

                        <hr className={divider}/>

                        <div>
                            <span className={selectorLabel}>Select colors</span>
                            <div className="flex justify-start gap-4">
                                {availableColors.length === 0 ? (
                                    <span className="text-sm text-[#999] italic">Currently unavailable</span>
                                ) : (
                                    availableColors.map(c => (
                                        <button
                                            key={c}
                                            className={`relative h-[38px] w-[38px] cursor-pointer rounded-full border-none transition-transform hover:scale-110 ${COLOR_BG[c.toLowerCase()] ?? ''} ${color === c ? "after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-base after:font-bold after:text-white after:content-['✓']" : ''}`}
                                            onClick={() => { handleSelectColor(c); setQuantity(1); }}
                                        ></button>
                                    ))
                                )}
                            </div>
                        </div>

                        <hr className={divider}/>

                        <div>
                            <span className={selectorLabel}>Choose Size</span>
                            <div className="flex flex-wrap justify-start gap-3">
                                {SIZES.map(s => {
                                    const disabled = !color || !variantExists(color, s);
                                    return (
                                        <button
                                            key={s}
                                            disabled={disabled}
                                            className={`cursor-pointer rounded-[99px] border-none px-4 py-2 text-[15px] transition-all ${
                                                disabled
                                                    ? 'hidden'
                                                    : size === s
                                                        ? 'bg-black text-white'
                                                        : 'bg-[#f0f0f0] text-[#666] hover:bg-[#e0e0e0]'
                                            }`}
                                            onClick={() => { setSize(s); setQuantity(1); }}
                                        >
                                            {s}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {selectedStock && (
                            outOfStock ? (
                                <p className="m-0 mb-4 pt-5 text-lg font-semibold text-[#ff3333]">Out of stock</p>
                            ) : (
                                <p className="m-0 mb-4 pt-5 text-lg font-semibold text-[#666]">In stock: {selectedStock.stock}</p>
                            )
                        )}

                        <div className="flex w-full flex-col items-start gap-5">
                            <div className="flex w-full flex-row gap-5 max-md:gap-3">
                                <div className="flex w-[150px] min-w-[130px] items-center justify-between rounded-[30px] bg-[#f0f0f0] px-4 py-2.5 max-md:w-auto max-md:min-w-0 max-md:flex-none max-md:gap-0.5 max-md:px-2.5 max-md:py-2 [&_button]:flex [&_button]:h-[30px] [&_button]:w-[30px] [&_button]:cursor-pointer [&_button]:items-center [&_button]:justify-center [&_button]:border-none [&_button]:bg-none [&_button]:p-0 [&_button]:text-xl [&_button]:leading-none [&_button]:font-bold [&_button]:text-black max-md:[&_button]:h-[26px] max-md:[&_button]:w-[26px] max-md:[&_button]:text-lg">
                                    <button onClick={() => handleQuantityChange('decrease')}>-</button>
                                    <input
                                        type="text"
                                        className="w-10 border-none bg-transparent p-0 text-center text-base font-medium text-black outline-none max-md:w-[30px] max-md:text-[15px]"
                                        value={quantity}
                                        onChange={(e) => handleQuantityChange('input', e.target.value)}
                                        onBlur={handleQuantityEmpty}
                                    />
                                    <button onClick={() => handleQuantityChange('increase')}>+</button>
                                </div>
                                <button className="w-2/5 cursor-pointer rounded-[40px] border-none bg-black text-base font-medium text-white transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40 max-md:w-auto max-md:flex-auto max-md:px-5 max-md:py-4 max-md:text-sm max-md:whitespace-nowrap" onClick={handleAddtoCart} disabled={!selectedStock || outOfStock}>Add to Cart</button>
                            </div>
                            <button className="w-[calc(40%+150px+20px)] cursor-pointer rounded-[40px] border border-black bg-white py-3 text-base font-medium text-black transition-colors enabled:hover:bg-black enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-40 max-md:w-full max-md:py-4" onClick={handleBuyNow} disabled={!selectedStock || outOfStock}>Buy Now</button>
                        </div>

                        <ConfirmModal
                            isOpen={pendingAction !== null}
                            onClose={() => setPendingAction(null)}
                            onConfirm={handleConfirmLogin}
                            title="Login Required"
                            content={
                            pendingAction === 'buy'
                                ? "You need to log in to proceed with direct checkout."
                                : "You need to log in to add items to your shopping cart."
                            }
                            confirmText="Login"
                            cancelText="Continue Browsing"
                            variant="primary"
                        />
                    </div>
                </div>
            </section>
        
    );
}

