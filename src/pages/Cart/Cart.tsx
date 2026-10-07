import { Link } from "react-router-dom";
import OrderBill from "./OrderBill";
import OrderList from "./OrderList";
import './cart.css';
import { useEffect, useState } from 'react';
import type { Cart, CartItem } from "@/types";
import { CONFIG } from "@/config";

interface CartApiItem {
    id: number;
    productId: number;
    size: CartItem["size"];
    color: CartItem["color"];
    quantity: number;
    product: {
        title: string;
        image?: string | null;
        originalPrice: string | number;
        promotionPrice?: string | number | null;
    };
}

interface CartApiResponse {
    id: number;
    userId: number;
    items: CartApiItem[];
}

export default function Cart() {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // TODO: implement Guards => change userId
    const userId = 1001;

    useEffect(() => {
        const controller = new AbortController();
        const fetchItems = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const res = await fetch(`${CONFIG.API_URL}/carts?userId=${userId}`, {
                    signal: controller.signal
                });
                if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    
                const json: CartApiResponse = await res.json();
                const mapped: CartItem[] = (json.items ?? []).map((item) => ({
                    id: item.id,
                    productId: item.productId,
                    title: item.product.title,
                    image: item.product.image ?? undefined,
                    size: item.size,
                    color: item.color,
                    quantity: item.quantity,
                    unitPrice: Number(item.product.promotionPrice ?? item.product.originalPrice),
                }));
                setItems(mapped);
            }
            catch (err){
                if (err instanceof Error && err.name === "AbortError") return;
                setItems([]);
                setError("Could not load cart");
            }
            finally {
                setIsLoading(false);
            }
        }

        fetchItems();
        return () => controller.abort();
    }, [userId])

    const handleUpdateQuantity = async (productItem: CartItem, newQuantity: number) => {
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
            const res = await fetch(`${CONFIG.API_URL}/carts/items?userId=${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...productItem, quantity: newQuantity }),
            });
            if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        }
        catch {
            setItems(prevItems);
            setError("Could not update item");
        }
    };

    const handleRemoveItem = async (productItem: CartItem) => {
        const prevItems = items;
        setError(null);
        setItems(prev => prev.filter(item => item.id !== productItem.id));
        try {
            const res = await fetch(`${CONFIG.API_URL}/carts/items?userId=${userId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...productItem})
            });
            if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        }
        catch {
            setItems(prevItems);
            setError("Could not remove item");
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