import { Link } from "react-router-dom";
import './footer.css'

import facebook from '@/assets/facebook-icon.svg'
import email from '@/assets/mail-icon.svg'
import ig from '@/assets/ig-logo.svg'
import creditcard from '@/assets/creditcard-logo.svg'
import mastercard from '@/assets/mastercard-logo.svg'
import paypal from '@/assets/paypal-logo.svg'
import visa from '@/assets/visa-logo.svg'
import { useAuth } from "@/utils/auth";

export default function Footer(){
    const { loggedIn } = useAuth();

    const isGuest = !loggedIn;

    return (
        <footer className={`footer-container${isGuest ? " has-subscribe" : ""}`}>
            {isGuest && (
                <div className="subscribe-wrapper">
                    <section className="subscribe-container">
                        <div className="subscribe-text">
                            <h2>STAY UP-TO-DATE ABOUT <br/> OUR LATEST OFFERS</h2>
                        </div>

                        <form className="subscribe-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="input-group">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    required
                                />
                            </div>
                            <button type="submit" className="subscribe-btn">
                                Subscribe to Newsletter
                            </button>
                        </form>
                    </section>
                </div>
            )}

            <div className="footer-top">
                <div className="footer-brand">
                    <h2>ShopCommerce</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque aspernatur quia corrupti aperiam ex ea possimus por</p>
                    <div className="social-icons">
                        <button aria-label="Facebook">
                            <img src={facebook}></img>
                        </button>
                        <button aria-label="Instagram">
                            <img src={ig}></img>
                        </button>
                        <button aria-label="Email">
                            <img src={email}></img>
                        </button>
                    </div>
                </div>

                <div className="footer-links">
                    <div className="link-col">
                        <h3>COMPANY</h3>
                        <ul>
                            <li><Link to="/about">About</Link></li>
                            <li><Link to="/features">Features</Link></li>
                            <li><Link to="/works">Works</Link></li>
                            <li><Link to="/careers">Careers</Link></li>
                        </ul>
                    </div>

                    <div className="link-col">
                        <h3>HELP</h3>
                        <ul>
                            <li><Link to="/support">Support</Link></li>
                            <li><Link to="/delivery">Delivery</Link></li>
                            <li><Link to="/terms">Terms & Conditions</Link></li>
                            <li><Link to="/privacy">Privacy</Link></li>
                        </ul>
                    </div>

                    <div className="link-col">
                        <h3>FAQS</h3>
                        <ul>
                            <li><Link to="/account">Accounts</Link></li>
                            <li><Link to="/payment">Payment</Link></li>
                            <li><Link to="/order">Order</Link></li>
                            <li><Link to="/shipping">Shipping</Link></li>
                        </ul>
                    </div>

                    <div className="link-col">
                        <h3>RESOURCE</h3>
                        <ul>
                            <li><Link to="/tutorial">Tutorial</Link></li>
                            <li><Link to="/blog">Blog</Link></li>
                            <li><Link to="/playlist">Playlist</Link></li>
                            <li><Link to="/ebook">Free eBook</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
            

            <div className="footer-bottom">
                <p>ShopCommerce @ 2026 All rights reserved</p>
                <div className="payment-icons">
                    <button className="payment-badge" aria-label="Credit Card"><img src={creditcard} alt="Credit Card"/></button>
                    <button className="payment-badge" aria-label="Mastercard"><img src={mastercard} alt="Mastercard"/></button>
                    <button className="payment-badge" aria-label="Visa"><img src={visa} alt="Visa"/></button>
                    <button className="payment-badge" aria-label="Paypal"><img src={paypal} alt="Paypal"/></button>
                </div>
            </div>
        </footer>
    );
}