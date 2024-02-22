
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'react-toastify/dist/ReactToastify.css';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import PriceScrap from "./pages/priceScrap/PriceScrap.jsx";
import ExtractProduct from "./pages/extractProduct/ExtractProduct.jsx";
import {Search} from "./pages/search/Search.jsx";
import {CsvDb} from "./pages/csv-db/CsvDb.jsx";
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
    },
    {
        path: '/searchProduct',
        element: <Search/>
    },
    {
        path: '/csv-saver',
        element: <CsvDb/>
    }
])



ReactDOM.createRoot(document.getElementById('root')).render(
        <RouterProvider router={router}/> ,
)
