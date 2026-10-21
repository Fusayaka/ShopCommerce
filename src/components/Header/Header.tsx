import './header.css'
import { Link, useNavigate } from 'react-router-dom';
import logo from '@/assets/logo-placeholder.png'
import cart from '@/assets/icon-cart.jpg'
import lang from '@/assets/language.png'
import search from '@/assets/search.png'
import hamburgerbtn from '@/assets/hamburger.png'
import { useEffect, useRef, useState } from 'react';

type CurrentUser = { name?: string; avatar?: string };

function getCurrentUser(): CurrentUser | null {
    try {
        const raw = localStorage.getItem('user');
        return raw ? (JSON.parse(raw) as CurrentUser) : null;
    } catch {
        return null;
    }
}

export default function Header() {
    const isGuest = !localStorage.getItem('token');
    const currentUser = getCurrentUser();
    const userInitial = (currentUser?.name ?? 'U').charAt(0).toUpperCase();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState('vi');
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const searchInputRef = useRef<HTMLInputElement>(null);
    
    const handleLangChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentLang(event.target.value);
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    const handleSearchProducts = () => {
        if (searchTerm.trim() !== ""){
            navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`)
        }
        setIsSearchOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == "Enter"){
            handleSearchProducts();
        }
    }

    useEffect(() => {
        if (isSearchOpen) searchInputRef.current?.focus();
    }, [isSearchOpen]);

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
                <img src={search} alt='search' className='search-icon' onClick={handleSearchProducts} />
            </div>

            <div className='header-actions'>
                <button
                    className='mobile-search-btn'
                    onClick={() => setIsSearchOpen((open) => !open)}
                    aria-label='Search'
                >
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

                {isGuest
                    ?
                    <Link to="login" className='login-btn'>
                        Login
                    </Link>
                    :
                    <Link to="/profile" className='avatar-btn' aria-label='Account'>
                        {currentUser?.avatar
                            ? <img src={currentUser.avatar} alt={currentUser?.name ?? 'User'} />
                            : <span className='avatar-fallback'>{userInitial}</span>}
                    </Link>
                }
            </div>

            <div className={`mobile-search-bar ${isSearchOpen ? 'open' : ''}`}>
                <input
                    ref={searchInputRef}
                    type='text'
                    placeholder='Search for products'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <img src={search} alt='search' className='search-icon' onClick={handleSearchProducts} />
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
                        {isGuest && <Link to={'/login'} onClick={toggleMenu}>Login</Link>}
                    </nav>
                </div>
            </div>

        </header>
    );
}