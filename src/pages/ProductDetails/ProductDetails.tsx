import Comment from "./Comment";
import Overview from "./Overview";
import RelatedProduct from "./RelatedProduct";


export default function ProductDetails() {
    return (
        <div>
            <Overview/>
            <RelatedProduct/>
            <Comment/>
        </div>
    );
}