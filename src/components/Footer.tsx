import { Link } from "react-router-dom";

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

    const linkCol = "flex flex-col max-md:w-full max-md:text-left";
    const colHeading = "mt-0 mb-2.5 text-left text-base font-semibold tracking-[1px] max-md:mb-2";
    const colLink = "block whitespace-nowrap text-left text-[13px] text-[#666] no-underline transition-colors duration-200 hover:font-medium hover:text-black";
    const paymentBadge = "inline-flex items-center justify-center rounded-[15px] border border-white bg-white px-3 py-0.5 text-xs font-bold text-[#333] hover:border-gray-500 hover:bg-[#ffd3d3]";

    return (
        <footer
            className={`mt-auto bg-[#f2f2f2] px-[5%] pb-6 max-md:px-[30px] max-md:pt-0 max-md:pb-10 ${
                isGuest ? "overflow-hidden pt-12" : "pt-6"
            }`}
        >
            {isGuest && (
                <div className="relative z-10 mb-16">
                    <section className="relative flex items-center justify-between gap-5 rounded-[20px] bg-black px-16 py-9 before:absolute before:top-[-48px] before:left-1/2 before:-z-10 before:h-[calc(48px+50%)] before:w-screen before:-translate-x-1/2 before:bg-white before:content-[''] max-md:flex-col max-md:px-6 max-md:py-8 max-md:text-center">
                        <div className="flex-1">
                            <h2 className="m-0 max-w-[550px] text-[27px] leading-[1.1] font-black text-white max-md:text-xl">STAY UP-TO-DATE ABOUT <br/> OUR LATEST OFFERS</h2>
                        </div>

                        <form className="flex w-full max-w-[350px] flex-col gap-4 max-md:max-w-full" onSubmit={(e) => e.preventDefault()}>
                            <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    required
                                    className="w-full border-none bg-transparent text-sm outline-none placeholder:text-[#888]"
                                />
                            </div>
                            <button type="submit" className="cursor-pointer rounded-full border-none bg-white px-5 py-3.5 text-sm font-semibold text-black transition-[opacity,transform] duration-200 hover:-translate-y-0.5 hover:opacity-80">
                                Subscribe to Newsletter
                            </button>
                        </form>
                    </section>
                </div>
            )}

            <div className="mb-8 flex items-start gap-[60px] max-md:flex-col max-md:gap-2.5">
                <div className="flex shrink-0 grow-0 basis-[200px] flex-col items-start text-left">
                    <h2 className="mb-4 text-[32px] font-black">ShopCommerce</h2>
                    <p className="mb-4 text-left text-sm leading-[1.6] text-[#666]">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque aspernatur quia corrupti aperiam ex ea possimus por</p>
                    <div className="flex justify-start gap-3 [&_button]:flex [&_button]:h-9 [&_button]:w-9 [&_button]:cursor-pointer [&_button]:items-center [&_button]:justify-center [&_button]:rounded-full [&_button]:border [&_button]:border-[#d1d5db] [&_button]:bg-white [&_button]:transition-all [&_button]:duration-200 [&_button:hover]:border-black [&_button:hover]:bg-[#ffd3d3] [&_img]:h-[18px] [&_img]:w-[18px]">
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

                <div className="grid flex-1 grid-cols-4 gap-[30px] max-md:w-full max-md:grid-cols-2 max-md:gap-y-[15px] [&_li]:mb-2 [&_ul]:m-0 [&_ul]:list-none [&_ul]:p-0">
                    <div className={linkCol}>
                        <h3 className={colHeading}>COMPANY</h3>
                        <ul>
                            <li><Link to="/about" className={colLink}>About</Link></li>
                            <li><Link to="/features" className={colLink}>Features</Link></li>
                            <li><Link to="/works" className={colLink}>Works</Link></li>
                            <li><Link to="/careers" className={colLink}>Careers</Link></li>
                        </ul>
                    </div>

                    <div className={linkCol}>
                        <h3 className={colHeading}>HELP</h3>
                        <ul>
                            <li><Link to="/support" className={colLink}>Support</Link></li>
                            <li><Link to="/delivery" className={colLink}>Delivery</Link></li>
                            <li><Link to="/terms" className={colLink}>Terms & Conditions</Link></li>
                            <li><Link to="/privacy" className={colLink}>Privacy</Link></li>
                        </ul>
                    </div>

                    <div className={linkCol}>
                        <h3 className={colHeading}>FAQS</h3>
                        <ul>
                            <li><Link to="/account" className={colLink}>Accounts</Link></li>
                            <li><Link to="/payment" className={colLink}>Payment</Link></li>
                            <li><Link to="/order" className={colLink}>Order</Link></li>
                            <li><Link to="/shipping" className={colLink}>Shipping</Link></li>
                        </ul>
                    </div>

                    <div className={linkCol}>
                        <h3 className={colHeading}>RESOURCE</h3>
                        <ul>
                            <li><Link to="/tutorial" className={colLink}>Tutorial</Link></li>
                            <li><Link to="/blog" className={colLink}>Blog</Link></li>
                            <li><Link to="/playlist" className={colLink}>Playlist</Link></li>
                            <li><Link to="/ebook" className={colLink}>Free eBook</Link></li>
                        </ul>
                    </div>
                </div>
            </div>


            <div className="flex items-center justify-between border-t border-[#ddd] pt-6 text-sm text-[#666] max-md:flex-col max-md:items-center max-md:gap-2.5 max-md:text-center">
                <p>ShopCommerce @ 2026 All rights reserved</p>
                <div className="flex gap-2 max-md:flex-wrap max-md:justify-center [&_img]:h-5 [&_img]:w-[30px]">
                    <button className={paymentBadge} aria-label="Credit Card"><img src={creditcard} alt="Credit Card"/></button>
                    <button className={paymentBadge} aria-label="Mastercard"><img src={mastercard} alt="Mastercard"/></button>
                    <button className={paymentBadge} aria-label="Visa"><img src={visa} alt="Visa"/></button>
                    <button className={paymentBadge} aria-label="Paypal"><img src={paypal} alt="Paypal"/></button>
                </div>
            </div>
        </footer>
    );
}