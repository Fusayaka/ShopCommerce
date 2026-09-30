import { Link } from "react-router-dom";
import OrderBill from "./OrderBill";
import OrderList from "./OrderList";
import './cart.css';
import { useState } from 'react';
import { mockOrderItems } from "@/mockdata";

function getOrderItems(){
    return mockOrderItems.slice(0, 3);
}
export default function Cart() {
    const [items, setItems] = useState(getOrderItems());

    const handleUpdateQuantity = (orderItemId: string, newQuantity: number) => {
        setItems(prev => 
            prev.map(item => 
                item.orderItemId === orderItemId 
                    ? { ...item, quantity: newQuantity } 
                    : item
                )
        );
    };

    const handleRemoveItem = (orderItemId: string) => {
        setItems(prev => prev.filter(item => item.orderItemId !== orderItemId));
    };

    return (
        <section className="cart-section">
            <nav className="detail-breadcrumb">
                <Link to="/">Home</Link>
                <span className="breadcrumb-separator">{'>'}</span>
                <span>Cart</span>
            </nav>
            
            <h1 className="cart-title">SHOPPING CART</h1>
            
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
        </section>
    );
}