import { Link } from 'react-router-dom';
import './banner.css'
import bannerpc from './home-banner-pc.webp'
import banner from './home-banner.webp'

export default function Banner() {
    return (
        <section className='banner-container'>
            <div className='banner-content'>
                <h1 className='banner-title'>FIND WHAT MAKES YOU COMFORTABLE</h1>
                <p className='banner-description'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Autem quasi adipisci iusto, voluptatem maxime nam! Harum praesentium eveniet omnis porro recusandae pariatur rerum?</p>
                <Link to="/products" className="shop-btn">
                    Shop Now
                </Link>

                <div className='banner-stats'>
                    <div className='stat-item'>
                        <h3>200+</h3>
                        <p>International Brands</p>
                    </div>

                    <div className='stat-sep'></div>

                    <div className='stat-item'>
                        <h3>2.000+</h3>
                        <p>Quantity Products</p>
                    </div>

                    <div className='stat-sep'></div>

                    <div className='stat-item'>
                        <h3>30.000+</h3>
                        <p>Customers</p>
                    </div>
                </div>
            </div>

            <div className='banner-img'>
                <img src={bannerpc}/>
            </div>
        </section>
    );
}