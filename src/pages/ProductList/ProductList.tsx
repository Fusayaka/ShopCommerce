import Filter from "./Filter";
import ProductResultPage from "./ProductResultPage";
import './productList.css'
import { Link } from "react-router-dom";


export default function ProductList(){
    return (
        <section className="product-list-section">
            <nav className='detail-breadcrumb'>
                <Link to='/'>Home</Link> 
                {'  >  '}
                <Link to='/products'>Product</Link>
            </nav>
            
            <div className="product-list-container">
                <Filter />
                <ProductResultPage />
            </div>
        </section>
    );
}