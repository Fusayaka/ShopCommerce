import { Link } from 'react-router-dom';
import bannerpc from './home-banner-pc.webp'
import bannermb from './home-banner.webp'

export default function Banner() {
    return (
        <section className='flex min-h-[85vh] items-center justify-between bg-[#f2f0f1] px-[5%] pt-[60px] max-md:flex-col max-md:px-[30px] max-md:pt-10 max-md:text-center'>
            <div className='max-w-[450px] shrink-0 grow-0 basis-[55%] pb-[60px] max-md:max-w-full max-md:grow max-md:basis-auto max-md:pb-0'>
                <h1 className='m-0 mb-6 text-[clamp(2.5rem,5vw,50px)] leading-[1.1] font-black tracking-tight [text-wrap:balance] text-black max-md:text-[clamp(1.75rem,7.5vw,38px)] max-md:tracking-normal'>FIND WHAT MAKES YOU COMFORTABLE</h1>
                <p className='m-0 mb-6 text-base leading-[1.6] text-[#666] max-md:px-[3%] max-md:text-justify max-md:text-sm max-md:font-semibold'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Autem quasi adipisci iusto, voluptatem maxime nam! Harum praesentium eveniet omnis porro recusandae pariatur rerum?</p>
                <Link to="/products" className="mb-10 inline-block cursor-pointer rounded-full border-none bg-black px-10 py-3 text-base font-medium text-white no-underline transition-[transform,opacity] duration-200 hover:-translate-y-0.5 hover:opacity-75 max-md:w-full max-md:px-0">
                    Shop Now
                </Link>

                <div className='flex items-center gap-6 max-md:mx-auto max-md:w-fit max-md:flex-col max-md:flex-wrap max-md:items-start max-md:gap-4'>
                    <div className='max-md:text-left'>
                        <h3 className='m-0 mb-1 text-[30px] font-bold text-black max-md:text-[36px] max-md:font-semibold'>200+</h3>
                        <p className='m-0 text-sm text-[#666]'>International Brands</p>
                    </div>

                    <div className='h-[60px] w-px bg-[#dcdcdc] max-md:hidden'></div>

                    <div className='max-md:text-left'>
                        <h3 className='m-0 mb-1 text-[30px] font-bold text-black max-md:text-[36px] max-md:font-semibold'>2.000+</h3>
                        <p className='m-0 text-sm text-[#666]'>Quantity Products</p>
                    </div>

                    <div className='h-[60px] w-px bg-[#dcdcdc] max-md:hidden'></div>

                    <div className='max-md:text-left'>
                        <h3 className='m-0 mb-1 text-[30px] font-bold text-black max-md:text-[36px] max-md:font-semibold'>30.000+</h3>
                        <p className='m-0 text-sm text-[#666]'>Customers</p>
                    </div>
                </div>
            </div>

            <div className='flex h-full flex-1 items-end justify-center max-md:mt-10 max-md:w-full'>
                <picture>
                    <source
                        media='(max-width: 768px)'
                        srcSet={bannermb}
                    />
                    <img
                        src={bannerpc}
                        className='flex h-[600px] w-full max-w-[500px] items-center justify-center rounded-t-[40px] bg-[#e0e0e0] font-bold text-[#888]'
                    />
                </picture>
            </div>
        </section>
    );
}