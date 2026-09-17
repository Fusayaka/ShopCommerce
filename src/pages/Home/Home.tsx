import Banner from "./Banner";
import BrandMarquee from "./BrandMarquee";
import './home.css'
import Trending from "./Trending";

export default function Home(){
    return (
        <div className="home-page">
            <Banner/>
            <BrandMarquee/>
            <Trending/>
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
        </div>
    );
}