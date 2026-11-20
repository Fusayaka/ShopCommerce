import { Link, useNavigate } from 'react-router-dom';
import logo from '@/assets/logo-placeholder.svg';
import cart from '@/assets/icon-cart.svg';
import lang from '@/assets/language.svg';
import search from '@/assets/search.svg';
import hamburgerbtn from '@/assets/hamburger.svg';
import avatarPlaceholder from '@/assets/avatar-placeholder.svg';
import { useEffect, useRef, useState } from 'react';
import { useAuth, clearAuth } from '@/utils/auth';
import { useCartCount } from '@/utils/cartCount';
import { cartApi, type MiniCartResponse } from '@/api/cartApi';
import plhImg from '/images/cloth-placeholder.jpeg';
import { loginApi } from '@/api/loginApi';
import { productApi } from '@/api/productApi';
import type { Product } from '@/types';
import { CONFIG } from '@/config';

const DEBOUNCE = 600;

function productMinPrice(p: Product): number | undefined {
    if (!p.stocks || p.stocks.length === 0) return undefined;
    const prices = p.stocks.map((s) => Number(s.promotionPrice ?? s.originalPrice));
    return prices.length ? Math.min(...prices) : undefined;
}

export default function Header() {
    const { loggedIn, user: currentUser } = useAuth();
    const cartCount = useCartCount();

    const isGuest = !loggedIn;
    const avatarSrc = currentUser?.avatar || avatarPlaceholder;
    const isAdminOrManager = currentUser?.role === 'admin' || currentUser?.role === 'manager';

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [miniItems, setMiniItems] = useState<MiniCartResponse[]>([]);
    const [miniLoading, setMiniLoading] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isAvatarOpen, setIsAvatarOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState('vi');
    
    const [searchTerm, setSearchTerm] = useState("");
    const [searchProducts, setSearchProducts] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const navigate = useNavigate();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);
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

    const handleSearchSubmit = () => {
        if (searchTerm.trim() !== "") {
            navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
        }
        setIsSearchOpen(false);
        setShowSuggestions(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearchSubmit();
            setShowSuggestions(false);
        }
    };

    useEffect(() => {
        const query = searchTerm.trim();

        const timer = setTimeout(async () => {
            if (!query) {
                setSearchProducts([]);
                setIsSearching(false);
                setShowSuggestions(false);
                return;
            }

            setIsSearching(true);
            try {
                const res = await productApi.getProducts({ search: query, limit: CONFIG.SEARCH_LIMIT });
                const list = res?.data || [];
                setSearchProducts(Array.isArray(list) ? list : []);
                setShowSuggestions(true);
            } catch (err) {
                console.error("Failed to search products:", err);
                setSearchProducts([]);
            } finally {
                setIsSearching(false);
            }
        }, query ? DEBOUNCE : 0);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    const handleLogout = async () => {
        setIsAvatarOpen(false);
        await loginApi.logout();
        clearAuth();
        navigate('/', {replace: true});
    };

    const searchIcon = "h-5 w-5 cursor-pointer object-contain";
    const dropdownMessage = "p-3.5 text-center text-sm text-[#6b7280]";
    const avatarItem = "block w-full cursor-pointer rounded-[7px] border-none bg-none px-2.5 py-[9px] text-left text-sm font-medium text-[#374151] no-underline hover:bg-[#f3f4f6]";

    const renderSearchDropdown = () => {
        if (!showSuggestions || !searchTerm.trim()) return null;

        return (
            <div className="absolute top-[calc(100%+8px)] right-0 left-0 z-[1000] overflow-hidden rounded-xl border-3 border-[#e5e7eb] bg-white shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.05)]">
                {isSearching ? (
                    <div className={dropdownMessage}>Searching...</div>
                ) : searchProducts.length > 0 ? (
                    <>
                        <ul className="m-0 max-h-[300px] list-none overflow-y-auto p-0">
                            {searchProducts.map((prod) => (
                                <li
                                    key={prod.id}
                                    className="flex cursor-pointer items-center gap-2.5 border-b border-[#f3f4f6] px-2.5 py-2 transition-colors duration-200 last:border-b-0 hover:bg-[#f9fafb]"
                                    onMouseDown={() => {
                                        navigate(`/product/${prod.id}`);
                                        setShowSuggestions(false);
                                        setIsSearchOpen(false);
                                    }}
                                >
                                    <img
                                        src={prod.image || plhImg}
                                        alt={prod.title}
                                        onError={(e) => { e.currentTarget.src = plhImg; }}
                                        className="h-10 w-10 shrink-0 rounded-md bg-[#f7f8fa] object-cover"
                                    />
                                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                        <span className="overflow-hidden text-left text-sm font-medium text-ellipsis whitespace-nowrap text-[#111827] hover:underline">{prod.title}</span>
                                        {productMinPrice(prod) != null && (
                                            <span className="text-left text-[13px] font-semibold text-black">${productMinPrice(prod)}</span>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="cursor-pointer border-t border-[#e5e7eb] bg-white px-2.5 py-[5px] text-center text-[13px] font-bold text-[#94b6ff] transition-colors duration-200 hover:bg-[#f3f4f6]" onClick={handleSearchSubmit}>
                            View all results for "{searchTerm}"
                        </div>
                    </>
                ) : (
                    <div className={dropdownMessage}>No products found</div>
                )}
            </div>
        );
    };

    return (
        <header className='flex items-center justify-between border-b border-[#d1d5db] bg-white px-[5%] py-4 max-md:flex-wrap max-md:px-[30px] max-md:py-3'>
            <button className='hidden cursor-pointer border-none bg-none p-0 max-md:flex max-md:items-center' onClick={toggleMenu}>
                <img src={hamburgerbtn} alt='Menu' className='h-6 w-auto'/>
            </button>

            <div className='max-md:flex max-md:flex-1 max-md:justify-start max-md:pl-2.5 max-md:text-left'>
                <Link to="/" className='mr-2.5 block h-8'>
                    <img src={logo} alt='Shop Logo' className='h-8 w-auto object-contain'/>
                </Link>
            </div>

            <nav className='flex gap-[27px] max-md:hidden [&_a]:text-[13px] [&_a]:font-medium [&_a]:text-[#08060d] [&_a]:no-underline [&_a]:transition-opacity [&_a]:duration-200 [&_a:hover]:text-[deepskyblue]'>
                <Link to='/products'>Products</Link>
                <Link to='/download'>Download</Link>
                {isAdminOrManager && <Link to='/dashboard'>Dashboard</Link>}
            </nav>

            <div className='relative mx-[15px] flex w-[400px] max-w-[25%] items-center rounded-full bg-[#f4f3ec] py-2.5 px-5 max-md:hidden' ref={searchContainerRef}>
                <input
                    type='text'
                    placeholder='Search for products'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => searchTerm.trim() && setShowSuggestions(true)}
                    onKeyDown={handleKeyDown}
                    className='flex-1 border-none bg-transparent text-sm text-[#08060d] outline-none placeholder:text-[#6b6375]'
                />
                <img src={search} alt='search' className={searchIcon} onClick={handleSearchSubmit} />
                {renderSearchDropdown()}
            </div>

            <div className='flex items-center gap-6 max-md:gap-4 max-md:[&>*]:shrink-0 max-md:[&>*]:whitespace-nowrap'>
                <button
                    className='hidden cursor-pointer border-none bg-none p-0 max-md:flex max-md:items-center'
                    onClick={() => setIsSearchOpen((open) => !open)}
                    aria-label='Search'
                >
                    <img src={search} alt='search' className={searchIcon} />
                </button>

                <div className='flex items-center gap-1.5 max-md:relative max-md:block max-md:h-6 max-md:w-6'>
                    <img src={lang} alt='Language' className='h-5 w-5 object-contain max-md:h-full max-md:w-full max-md:pointer-events-none'/>
                    <select
                        value={currentLang}
                        onChange={handleLangChange}
                        className='cursor-pointer appearance-auto border-none bg-transparent text-[13px] font-medium text-[#08060d] outline-none max-md:absolute max-md:top-0 max-md:left-0 max-md:h-full max-md:w-full max-md:appearance-none max-md:text-base max-md:opacity-0'
                    >
                        <option value={"vi"}>VI</option>
                        <option value={"en"}>EN</option>
                        <option value={"jp"}>JP</option>
                    </select>
                </div>

                <div
                    className='relative inline-flex'
                    onMouseEnter={openMiniCart}
                    onMouseLeave={() => setIsCartOpen(false)}
                >
                    <Link to="/cart" className='group/cart relative inline-flex' aria-label='Cart'>
                        <img src={cart} alt='Cart' className='h-6 w-6 translate-y-1 object-contain transition-transform duration-200 group-hover/cart:scale-[1.35]'></img>
                        {cartCount > 0 && (
                            <span className='pointer-events-none absolute top-[-2px] right-[-8px] h-4 min-w-4 origin-center rounded-[100px] bg-[#e02424] px-[5px] text-center text-[11px] leading-4 font-bold text-white transition-transform duration-200 group-hover/cart:-translate-y-1 group-hover/cart:scale-[1.35]'>{cartCount > 99 ? '99+' : cartCount}</span>
                        )}
                    </Link>

                    {isCartOpen && (
                        <div className='absolute top-full right-0 z-[100] mt-2.5 w-[300px] rounded-[10px] border border-[#e5e7eb] bg-white p-3 shadow-[0_10px_30px_rgba(0,0,0,0.12)] max-md:w-[200px] before:absolute before:right-0 before:bottom-full before:h-2.5 before:w-full before:content-[""]'>
                            {isGuest ? (
                                <p className='m-0 px-1 py-3 text-center text-sm text-[#6b7280]'>Please sign in to view your cart.</p>
                            ) : miniLoading ? (
                                <p className='m-0 px-1 py-3 text-center text-sm text-[#6b7280]'>Loading…</p>
                            ) : miniItems.length === 0 ? (
                                <p className='m-0 px-1 py-3 text-center text-sm text-[#6b7280]'>Your cart is empty.</p>
                            ) : (
                                <>
                                    <ul className='m-0 max-h-[320px] list-none overflow-y-auto p-0'>
                                        {miniItems.map((item) => (
                                            <li
                                                key={`${item.id}-${item.size}-${item.color}`}
                                                className='flex items-center gap-2.5 border-b border-[#f3f4f6] px-1 py-2 last:border-b-0'
                                            >
                                                <img
                                                    src={item.image || plhImg}
                                                    alt={item.title}
                                                    onError={(e) => { e.currentTarget.src = plhImg; }}
                                                    onClick={() => navigate(`/product/${item.id}`)}
                                                    className='h-[50px] w-10 shrink-0 cursor-pointer rounded-md bg-[#f3f4f6] object-cover'
                                                />
                                                <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
                                                    <Link to={`/product/${item.id}`} className='mb-px overflow-hidden text-left text-sm leading-[1.25] font-semibold text-ellipsis whitespace-nowrap text-[#111827] no-underline hover:underline'>
                                                        {item.title}
                                                    </Link>
                                                    <span className='block pb-[3px] text-left text-xs leading-[1.2] whitespace-nowrap text-[#6b7280]'>Size: {item.size}</span>
                                                    <span className='block pb-[3px] text-left text-xs leading-[1.2] whitespace-nowrap text-[#6b7280]'>Color: {item.color}</span>
                                                </div>
                                                <span className='shrink-0 text-[13px] font-semibold text-[#374151]'>x {item.quantity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link to="/cart" className='mt-2.5 block rounded-lg bg-[#08060d] p-[9px] text-center text-sm font-semibold text-white no-underline hover:opacity-90'>View cart</Link>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {isGuest ? (
                    <Link to="login" className='flex items-center gap-2 rounded-full bg-[#08060d] px-[15px] py-[7px] text-[13px] font-semibold text-white no-underline transition-[opacity,transform] duration-200 hover:-translate-y-px hover:text-red-500 max-md:hidden'>
                        Login
                    </Link>
                ) : (
                    <div
                        className='relative inline-flex'
                        ref={avatarRef}
                        onMouseEnter={() => setIsAvatarOpen(true)}
                        onMouseLeave={() => setIsAvatarOpen(false)}
                    >
                        <img
                            src={avatarSrc}
                            alt={currentUser?.name ?? 'User'}
                            className='flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-none bg-[#08060d] object-cover no-underline transition-transform duration-200 hover:scale-[1.08]' aria-label='Account'
                            onClick={handleAvatarClick}
                            onError={(e) => { e.currentTarget.src = avatarPlaceholder; }}
                        />

                        {isAvatarOpen && (
                            <div className='absolute top-full right-0 z-[100] mt-[5px] w-[220px] rounded-[10px] border border-[#e5e7eb] bg-white p-1.5 text-left shadow-[0_10px_30px_rgba(0,0,0,0.12)] before:absolute before:right-0 before:bottom-full before:h-2.5 before:w-full before:content-[""]' role='menu'>
                                <div className='mb-1 flex items-center gap-2.5 border-b border-[#f3f4f6] px-2.5 py-2'>
                                    <img
                                        className='h-10 w-10 shrink-0 rounded-full bg-[#08060d] object-cover'
                                        src={avatarSrc}
                                        alt={currentUser?.name ?? 'User'}
                                        onError={(e) => { e.currentTarget.src = avatarPlaceholder; }}
                                    />
                                    <div className='flex min-w-0 flex-col items-start gap-0.5'>
                                        <span className='max-w-full overflow-hidden text-left text-sm font-semibold text-ellipsis whitespace-nowrap text-[#111827]'>{currentUser?.name ?? 'User'}</span>
                                        {currentUser?.email && (
                                            <span className='ml-0.5 max-w-full overflow-hidden text-left text-xs text-ellipsis whitespace-nowrap text-[#6b7280]'>{currentUser.email}</span>
                                        )}
                                    </div>
                                </div>
                                <Link to='/profile' role='menuitem' className={avatarItem} onClick={() => setIsAvatarOpen(false)}>
                                    Profile
                                </Link>
                                <Link to='/orders' role='menuitem' className={avatarItem} onClick={() => setIsAvatarOpen(false)}>
                                    My Orders
                                </Link>
                                {isAdminOrManager && (<Link to='/dashboard' role='menuitem' className={avatarItem} onClick={() => setIsAvatarOpen(false)}>
                                    Dashboard
                                </Link>)}
                                <button
                                    type='button'
                                    role='menuitem'
                                    className={`${avatarItem} text-[#e02424]`}
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className={`relative hidden ${isSearchOpen ? 'max-md:order-last max-md:mt-3 max-md:flex max-md:w-full max-md:items-center max-md:gap-2 max-md:rounded-full max-md:border max-md:border-[#d1d5db] max-md:bg-[#f3f4f6] max-md:px-4 max-md:py-2.5' : ''}`}>
                <input
                    ref={searchInputRef}
                    type='text'
                    placeholder='Search for products'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => searchTerm.trim() && setShowSuggestions(true)}
                    onKeyDown={handleKeyDown}
                    className='min-w-0 flex-1 border-none bg-transparent text-base text-[#08060d] outline-none placeholder:text-[#6b6375]'
                />
                <img src={search} alt='search' className={`${searchIcon}`} onClick={handleSearchSubmit} />
                {renderSearchDropdown()}
            </div>

            <div
                className={`fixed inset-0 z-[999] h-screen w-screen bg-black/50 transition-[opacity,visibility] duration-300 ${
                    isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
                }`}
                onClick={toggleMenu}
            >
                <div
                    className={`absolute top-0 left-[-250px] flex h-full w-[250px] flex-col bg-white p-6 shadow-[2px_0_8px_rgba(0,0,0,0.1)] transition-transform duration-300 ${
                        isMenuOpen ? 'translate-x-[250px]' : ''
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button className='mb-6 cursor-pointer self-end border-none bg-none p-2 text-xl' onClick={toggleMenu}>
                        ✕
                    </button>

                    <nav className='flex flex-col gap-5 [&_a]:text-base [&_a]:font-medium [&_a]:text-[#08060d] [&_a]:no-underline'>
                        <Link to={'/'} onClick={toggleMenu}>Home</Link>
                        <Link to={'/products'} onClick={toggleMenu}>Products</Link>
                        <Link to={'/download'} onClick={toggleMenu}>Download</Link>
                        {isAdminOrManager && <Link to='/dashboard' onClick={toggleMenu}>Dashboard</Link>}
                        {isGuest && <Link to={'/login'} onClick={toggleMenu}>Login</Link>}
                    </nav>
                </div>
            </div>
        </header>
    );
}