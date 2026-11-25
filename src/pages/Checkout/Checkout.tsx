import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/utils/auth';
import ProductList from './ProductList';
import Payment from './Payment';
import { ROUTES } from '@/constants/routes';

export default function Checkout() {
  const { loggedIn } = useAuth();
  const [cartSummary, setCartSummary] = useState({ subtotal: 0, count: 0 });

  const handleDataLoaded = useCallback((subtotal: number, count: number) => {
    setCartSummary({ subtotal, count });
  }, []);

  const sectionCls = "mx-auto box-border px-[5%] py-6 text-[#111827] max-md:px-[30px] max-md:py-5";
  const breadcrumbCls = "mb-6 flex items-center gap-2 text-sm text-[#606060] [&_a]:text-[#606060] [&_a]:no-underline [&_a:hover]:underline max-[500px]:text-xs";
  const titleCls = "text-center text-[32px] leading-[1.1] font-extrabold text-[#111827] uppercase max-md:mb-5 max-[500px]:text-[26px]";

  if (!loggedIn) {
    return (
      <section className={sectionCls}>
        <nav className={breadcrumbCls}>
          <Link to={ROUTES.HOME}>Home</Link>
          <span className="text-xs">{'>'}</span>
          <Link to={ROUTES.CART}>Cart</Link>
          <span className="text-xs">{'>'}</span>
          <span>Checkout</span>
        </nav>

        <h1 className={titleCls}>CHECKOUT</h1>

        <div className="mx-auto my-10 flex max-w-[480px] flex-col items-center justify-center gap-4 rounded-2xl border border-[#e5e7eb] bg-white px-6 py-16 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] [&_p]:m-0 [&_p]:text-[15px] [&_p]:leading-normal [&_p]:text-[#4b5563]">
          <p>Please log in to proceed with your checkout.</p>
          <Link to={ROUTES.LOGIN} className="inline-flex items-center justify-center rounded-xl bg-[#111827] px-9 py-3 text-sm font-semibold text-white no-underline shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-px hover:bg-[#1f2937] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
            Login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className={sectionCls}>
      <nav className={breadcrumbCls}>
        <Link to={ROUTES.HOME}>Home</Link>
        <span className="text-xs">{'>'}</span>
        <Link to={ROUTES.CART}>Cart</Link>
        <span className="text-xs">{'>'}</span>
        <span>Checkout</span>
      </nav>

      <h1 className={titleCls}>Checkout</h1>

      <div className="flex flex-col gap-8">
        <ProductList onDataLoaded={handleDataLoaded} />

        {cartSummary.count > 0 && (
          <Payment subtotal={cartSummary.subtotal} itemCount={cartSummary.count} />
        )}
      </div>
    </section>
  );
}