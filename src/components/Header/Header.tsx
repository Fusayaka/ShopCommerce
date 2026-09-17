import './header.css'
import { Link } from 'react-router-dom';
import logo from '@/assets/logo-placeholder.png'
import cart from '@/assets/icon-cart.jpg'

export default function Header() {
    return (
        <header className='header-container'>
            <div className='header-logo'>
                <Link to="/">
                    <img src={logo} alt='Shop Logo'/>
                </Link>
            </div>

            <nav className='header-nav'>
                <a href='/products'>Products</a>
                <a href='/download'>Download</a>
                <a href='/dashboard'>Dashboard</a>
            </nav>

            <div className='header-search'>
                {/* <span className='search-icon'>🔍</span> */}
                <input type='text' placeholder='Search for products'/>
            </div>

            <div className='header-actions'>
                <div className='lang-selector'>
                    <select defaultValue={"vi"}>
                        <option value={"vi"}>VI</option>
                        <option value={"en"}>EN</option>
                        <option value={"jp"}>JP</option>
                    </select>
                </div>

                <Link to="/cart" className='cart-btn'aria-label='Cart'>
                    <img src={cart} alt='Cart'></img>
                </Link>

                <Link to="login" className='login-btn'>
                    Login
                </Link>
            </div>

        </header>
    );
}