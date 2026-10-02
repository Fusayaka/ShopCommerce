import './header.css'
import { Link, useNavigate } from 'react-router-dom';
import logo from '@/assets/logo-placeholder.png'
import cart from '@/assets/icon-cart.jpg'
import lang from '@/assets/language.png'
import search from '@/assets/search.png'
import hamburgerbtn from '@/assets/hamburger.png'
import { useState } from 'react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState('vi');
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    
    const handleLangChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentLang(event.target.value);
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    const handleSearchProducts = () => {
        if (searchTerm.trim() !== ""){
            navigate(`/products?name=${encodeURIComponent(searchTerm.trim())}`)
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == "Enter"){
            handleSearchProducts();
        }
    }

    return (
        <header className='header-container'>
            <button className='hamburger-btn' onClick={toggleMenu}>
                <img src={hamburgerbtn} alt='Menu'/>
            </button>

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
                <input 
                    type='text' 
                    placeholder='Search for products'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <img src={search} alt='search' className='search-icon' />
            </div>

            <div className='header-actions'>
                <button className='mobile-search-btn'>
                    <img src={search} alt='search' className='search-icon' />
                </button>

                <div className='lang-selector'>
                    <img src={lang} alt='Language' className='lang-icon'/>
                    <select value={currentLang} onChange={handleLangChange}>
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

            <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
                <div className='mobile-menu-content' onClick={(e) => e.stopPropagation()}>
                    <button className='close-menu-btn' onClick={toggleMenu}>
                        ✕
                    </button>

                    <nav className='mobile-nav'>
                        <Link to={'/'} onClick={toggleMenu}>Home</Link>
                        <Link to={'/products'} onClick={toggleMenu}>Products</Link>
                        <Link to={'/download'} onClick={toggleMenu}>Download</Link>
                        <Link to={'/dashboard'} onClick={toggleMenu}>Dashboard</Link>
                        <Link to={'/login'} onClick={toggleMenu}>Login</Link>
                    </nav>
                </div>
            </div>

        </header>
    );
}