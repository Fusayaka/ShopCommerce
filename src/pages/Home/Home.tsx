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
        </div>
    );
}