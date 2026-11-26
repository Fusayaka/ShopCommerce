import Banner from "./Banner";
import BrandMarquee from "./BrandMarquee";
import Trending from "./Trending";

export default function Home(){
    return (
        <div className="flex w-full flex-col">
            <Banner/>
            <BrandMarquee/>
            <Trending/>
        </div>
    );
}