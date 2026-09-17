import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                index: true,
                element:<Home/>
            },
            {
                path: "product",
                element:<h2> This is Product Page</h2>
            },
            {
                path: "cart",
                element:<h2> This is Cart Page</h2>
            },
            {
                path: "login",
                element:<h2> This is Login Page</h2>
            },
            {
                path: "dashboard",
                element:<h2> This is Dashboard Page</h2>
            },
            {
                path: "download",
                element:<h2> This is Download Page</h2>
            },
        ]
    },
    {
        path: "*",
        element: <h2>Page Not Found</h2> 
    }
])