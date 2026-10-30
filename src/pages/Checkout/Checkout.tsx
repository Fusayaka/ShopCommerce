import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/utils/auth';
import ProductList from './ProductList';
import Payment from './Payment';
import './checkout.css';

export default function Checkout() {
  const { loggedIn } = useAuth();
  const [cartSummary, setCartSummary] = useState({ subtotal: 0, count: 0 });

  const handleDataLoaded = useCallback((subtotal: number, count: number) => {
    setCartSummary({ subtotal, count });
  }, []);

  if (!loggedIn) {
    return (
      <section className="checkout-page-section">
        <nav className="checkout-breadcrumb">
          <Link to="/">Home</Link>
          <span className="checkout-breadcrumb-separator">{'>'}</span>
          <Link to="/cart">Cart</Link>
          <span className="checkout-breadcrumb-separator">{'>'}</span>
          <span>Checkout</span>
        </nav>

        <h1 className="checkout-page-title">CHECKOUT</h1>

        <div className="checkout-login-prompt">
          <p>Please log in to proceed with your checkout.</p>
          <Link to="/login" className="checkout-login-btn">
            Login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-page-section">
      <nav className="checkout-breadcrumb">
        <Link to="/">Home</Link>
        <span className="checkout-breadcrumb-separator">{'>'}</span>
        <Link to="/cart">Cart</Link>
        <span className="checkout-breadcrumb-separator">{'>'}</span>
        <span>Checkout</span>
      </nav>

      <h1 className="checkout-page-title">Checkout</h1>

      <div className="checkout-content-container">
        <ProductList onDataLoaded={handleDataLoaded} />

        {cartSummary.count > 0 && (
          <Payment subtotal={cartSummary.subtotal} itemCount={cartSummary.count} />
        )}
      </div>
    </section>
  );
}