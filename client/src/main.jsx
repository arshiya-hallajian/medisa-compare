
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'react-toastify/dist/ReactToastify.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import PriceScrap from "./pages/priceScrap/PriceScrap.jsx";
import ExtractProduct from "./pages/extractProduct/ExtractProduct.jsx";
import('preline')

const router = createBrowserRouter([
    {
        path: '/',
        element: <App/>
    },
    {
        path:"/priceChecker",
        element: <PriceScrap/>
    },
    {
        path: '/extractProduct',
        element: <ExtractProduct/>
    }
])



ReactDOM.createRoot(document.getElementById('root')).render(
        <RouterProvider router={router}/> ,
)
