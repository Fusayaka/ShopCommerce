import { Link } from "react-router-dom";
import OrderBill from "./OrderBill";
import OrderList from "./OrderList";
import { useEffect, useState } from 'react';
import type { CartLineItem } from "@/types";
import { cartApi } from "@/api/cartApi";
import { notifyCartChanged } from "@/utils/cartCount";
import { toast } from "react-toastify";
import { useAuth } from "@/utils/auth";

export default function Cart() {
    const { loggedIn, user } = useAuth();

    const [items, setItems] = useState<CartLineItem[]>([]);
    const [loading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        let active = true;
        const fetchItems = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const cart = await cartApi.getCart();
                if (!active) return;

                const mapped: CartLineItem[] = (cart.items ?? []).map((item) => ({
                    id: item.id,
                    stockId: item.stockId,
                    productId: item.stock.productId,
                    title: item.stock.product.title,
                    image: item.stock.product.image ?? undefined,
                    size: item.stock.size,
                    color: item.stock.color,
                    quantity: item.quantity,
                    unitPrice: Number(item.stock.promotionPrice ?? item.stock.originalPrice),
                }));
                setItems(mapped);
            }
            catch {
                if (!active) return;
                setItems([]);
                setError("Could not load cart");
            }
            finally {
                if (active) setIsLoading(false);
            }
        }

        fetchItems();
        return () => { active = false; };
    }, [user])

    const sectionCls = "mx-auto max-w-full px-[5%] py-6 max-md:px-[30px] max-md:py-5";
    const breadcrumbCls = "mb-6 flex items-center gap-2 text-sm text-[#606060] [&_a]:text-[#606060] [&_a]:no-underline [&_a:hover]:text-black max-[500px]:mb-4 max-[500px]:text-xs";
    const titleCls = "mb-6 overflow-hidden text-left text-[40px] leading-none font-black text-black uppercase max-md:mb-5 max-md:text-center max-md:text-[32px] max-[500px]:mb-4 max-[500px]:text-[26px]";
    const statusCls = "py-10 text-center text-base text-[#606060]";

    if (!loggedIn) {
        return (
            <section className={sectionCls}>
                <nav className={breadcrumbCls}>
                    <Link to="/">Home</Link>
                    <span className="text-xs">{'>'}</span>
                    <span>Cart</span>
                </nav>

                <h1 className={titleCls}>SHOPPING CART</h1>

                <div className="flex flex-col items-center gap-5 py-[60px] text-center [&_p]:m-0 [&_p]:text-base [&_p]:text-[#606060]">
                    <p>Please log in to view your cart.</p>
                    <Link to="/login" className="rounded-full bg-black px-10 py-3 text-[15px] font-semibold text-white no-underline transition-opacity hover:opacity-85">Login</Link>
                </div>
            </section>
        );
    }

    const handleUpdateQuantity = async (productItem: CartLineItem, newQuantity: number) => {
        const prevItems = items;
        setError(null);
        setItems(prev =>
            prev.map(item =>
                item.id === productItem.id
                    ? { ...item, quantity: newQuantity }
                    : item
                )
        );
        try {
            await cartApi.updateQuantity({
                stockId: productItem.stockId,
                quantity: newQuantity,
            });
            notifyCartChanged();
        }
        catch {
            setItems(prevItems);
            setError("Could not update item");
        }
    };

    const handleRemoveItem = async (productItem: CartLineItem) => {
        const prevItems = items;
        setError(null);
        setItems(prev => prev.filter(item => item.id !== productItem.id));
        try {
            await cartApi.removeItem(productItem.stockId);
            notifyCartChanged();
            toast.success("Remove item successfully!");
        }
        catch {
            setItems(prevItems);
        }
    };

    return (
        <section className={sectionCls}>
            <nav className={breadcrumbCls}>
                <Link to="/">Home</Link>
                <span className="text-xs">{'>'}</span>
                <span>Cart</span>
            </nav>

            <h1 className={titleCls}>SHOPPING CART</h1>

            {loading ? (
                <div className={statusCls}>Loading...</div>
            ) : items.length === 0 ? (
                <div className={statusCls}>{error ?? "Your cart is empty."}</div>
            ) : (
                <>
                    {error && <div className="py-3 text-center text-base text-[#ff3333]">{error}</div>}
                    <div className="flex items-start gap-6 max-md:flex-col max-md:gap-5">
                        <div className="min-w-0 flex-1 max-md:mx-auto max-md:w-full max-md:flex-none max-md:items-center">
                            <OrderList
                                items={items}
                                onUpdateQuantity={handleUpdateQuantity}
                                onRemoveItem={handleRemoveItem}
                            />
                        </div>
                        <div className="w-auto max-[992px]:w-[350px] max-md:w-full max-[500px]:mx-auto max-[500px]:w-[90%]">
                            <OrderBill
                                items={items}
                            />
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}