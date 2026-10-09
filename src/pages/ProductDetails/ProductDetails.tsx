import Comment from "./Comment";
import Overview from "./Overview";
import RelatedProduct from "./RelatedProduct";
import './productDetails.css'


export default function ProductDetails() {
    return (
        <div className="product-detail">
            <Overview/>
            <RelatedProduct/>
            <Comment/>
        </div>
    );
}