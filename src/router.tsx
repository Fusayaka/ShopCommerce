import { createBrowserRouter, ScrollRestoration } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import ProductList from "./pages/ProductList";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";


export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <>
                <ScrollRestoration/>
                <App/>
            </>
        ),
        children: [
            {
                index: true,
                element:<Home/>
            },
            {
                path: "products",
                element: <ProductList/>
            },
            {
                path: "product/:productId",
                element: <ProductDetails/>
            },
            {
                path: "cart",
                element: <Cart/>
            },
            {
                path: "download",
                element:<h2> This is Download Page</h2>
            },
            {
                path: "profile",
                element: <Profile/>
            },
            {
                path: "checkout",
                element: <Checkout/>
            }
        ]
    },
    {
        path: "login",
        element:<Login/>
    },
    {
        path: "*",
        element: <h2>Page Not Found</h2> 
    },
    {
        path: "dashboard",
        element: <Dashboard/>
    },
])