import { Link } from "react-router-dom";
import OrderBill from "./OrderBill";
import OrderList from "./OrderList";
import './cart.css';
import { useEffect, useState } from 'react';
import type { CartLineItem } from "@/types";
import { cartApi } from "@/api/cartApi";
import { toast } from "react-toastify";

export default function Cart() {
    const [items, setItems] = useState<CartLineItem[]>([]);
    const [loading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // TODO: implement Guards => change userId
    const userId = 1001;

    useEffect(() => {
        let active = true;
        const fetchItems = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const cart = await cartApi.getCart(userId);
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
    }, [userId])

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
            await cartApi.updateQuantity(userId, {
                stockId: productItem.stockId,
                quantity: newQuantity,
            });
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
            await cartApi.removeItem(userId, productItem.stockId);
            toast.success("Remove item successfully!");
        }
        catch {
            setItems(prevItems);
        }
    };

    return (
        <section className="cart-section">
            <nav className="detail-breadcrumb">
                <Link to="/">Home</Link>
                <span className="breadcrumb-separator">{'>'}</span>
                <span>Cart</span>
            </nav>
            
            <h1 className="cart-title">SHOPPING CART</h1>

            {loading ? (
                <div className="cart-status">Loading...</div>
            ) : items.length === 0 ? (
                <div className="cart-status">{error ?? "Your cart is empty."}</div>
            ) : (
                <>
                    {error && <div className="cart-status cart-status-error">{error}</div>}
                    <div className="cart-container">
                        <div className="cart-list-wrapper">
                            <OrderList
                                items={items}
                                onUpdateQuantity={handleUpdateQuantity}
                                onRemoveItem={handleRemoveItem}
                            />
                        </div>
                        <div className="cart-bill-wrapper">
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