import './header.css'
import { Link, useNavigate } from 'react-router-dom';
import logo from '@/assets/logo-placeholder.svg'
import cart from '@/assets/icon-cart.svg'
import lang from '@/assets/language.svg'
import search from '@/assets/search.svg'
import hamburgerbtn from '@/assets/hamburger.svg'
import avatarPlaceholder from '@/assets/avatar-placeholder.svg'
import { useEffect, useRef, useState } from 'react';
import { useAuth, clearAuth } from '@/utils/auth';
import { useCartCount } from '@/utils/cartCount';
import { cartApi, type MiniCartResponse } from '@/api/cartApi';
import plhImg from '/images/cloth-placeholder.jpeg';

export default function Header() {
    const { loggedIn, user: currentUser } = useAuth();
    const cartCount = useCartCount();

    const isGuest = !loggedIn;
    const avatarSrc = currentUser?.avatar || avatarPlaceholder;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [miniItems, setMiniItems] = useState<MiniCartResponse[]>([]);
    const [miniLoading, setMiniLoading] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isAvatarOpen, setIsAvatarOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState('vi');
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const avatarRef = useRef<HTMLDivElement>(null);

    const handleLangChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentLang(event.target.value);
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    const openMiniCart = async () => {
        setIsCartOpen(true);
        if (isGuest) return;
        setMiniLoading(true);
        try {
            const items = await cartApi.getMiniCart();
            setMiniItems(Array.isArray(items) ? items : []);
        } catch {
            setMiniItems([]);
        } finally {
            setMiniLoading(false);
        }
    };

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

    useEffect(() => {
        if (!isAvatarOpen) return;
        const handleOutside = (e: Event) => {
            if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
                setIsAvatarOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutside);
        document.addEventListener('touchstart', handleOutside);
        return () => {
            document.removeEventListener('mousedown', handleOutside);
            document.removeEventListener('touchstart', handleOutside);
        };
    }, [isAvatarOpen]);

    const handleAvatarClick = (e: React.MouseEvent) => {
        if (window.matchMedia('(hover: none)').matches) {
            e.preventDefault();
            setIsAvatarOpen((open) => !open);
        }
    };

    const handleLogout = () => {
        setIsAvatarOpen(false);
        clearAuth();
        navigate('/login');
    };

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

                <div
                    className='cart-menu'
                    onMouseEnter={openMiniCart}
                    onMouseLeave={() => setIsCartOpen(false)}
                >
                    <Link to="/cart" className='cart-btn' aria-label='Cart'>
                        <img src={cart} alt='Cart'></img>
                        {cartCount > 0 && (
                            <span className='cart-badge'>{cartCount > 99 ? '99+' : cartCount}</span>
                        )}
                    </Link>

                    {isCartOpen && (
                        <div className='mini-cart'>
                            {isGuest ? (
                                <p className='mini-cart-empty'>Please sign in to view your cart.</p>
                            ) : miniLoading ? (
                                <p className='mini-cart-empty'>Loading…</p>
                            ) : miniItems.length === 0 ? (
                                <p className='mini-cart-empty'>Your cart is empty.</p>
                            ) : (
                                <>
                                    <ul className='mini-cart-list'>
                                        {miniItems.map((item) => (
                                            <li
                                                key={`${item.id}-${item.size}-${item.color}`}
                                                className='mini-cart-item'
                                            >
                                                <img
                                                    src={item.image || plhImg}
                                                    alt={item.title}
                                                    onError={(e) => { e.currentTarget.src = plhImg; }}
                                                    onClick={() => navigate(`/product/${item.id}`)}
                                                    style={{cursor: 'pointer'}}
                                                />
                                                <div className='mini-cart-info'>
                                                    <Link to={`/product/${item.id}`} className='mini-cart-title'>
                                                        {item.title}
                                                    </Link>
                                                    <span className='mini-cart-meta'>Size: {item.size}</span>
                                                    <span className='mini-cart-meta'>Color: {item.color}</span>
                                                </div>
                                                <span className='mini-cart-qty'>x {item.quantity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link to="/cart" className='mini-cart-view'>View cart</Link>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {isGuest
                    ?
                    <Link to="login" className='login-btn'>
                        Login
                    </Link>
                    :
                    <div
                        className='avatar-menu'
                        ref={avatarRef}
                        onMouseEnter={() => setIsAvatarOpen(true)}
                        onMouseLeave={() => setIsAvatarOpen(false)}
                    >
                            <img
                                src={avatarSrc}
                                alt={currentUser?.name ?? 'User'}
                                className='avatar-btn' aria-label='Account' 
                                onClick={handleAvatarClick}
                                onError={(e) => { e.currentTarget.src = avatarPlaceholder; }}
                            />

                        {isAvatarOpen && (
                            <div className='avatar-dropdown' role='menu'>
                                <div className='avatar-dropdown-header'>
                                    <img
                                        className='avatar-dropdown-img'
                                        src={avatarSrc}
                                        alt={currentUser?.name ?? 'User'}
                                        onError={(e) => { e.currentTarget.src = avatarPlaceholder; }}
                                    />
                                    <div className='avatar-dropdown-info'>
                                        <span className='avatar-dropdown-name'>{currentUser?.name ?? 'User'}</span>
                                        {currentUser?.email && (
                                            <span className='avatar-dropdown-email'>{currentUser.email}</span>
                                        )}
                                    </div>
                                </div>
                                <Link to='/profile' role='menuitem' onClick={() => setIsAvatarOpen(false)}>
                                    Profile
                                </Link>
                                <Link to='/dashboard' role='menuitem' onClick={() => setIsAvatarOpen(false)}>
                                    Dashboard
                                </Link>
                                <button
                                    type='button'
                                    role='menuitem'
                                    className='avatar-dropdown-logout'
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
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