import extractIcon from './assets/extract.svg'
import PriceIcon from './assets/price-list.svg'
import SearchProduct from './assets/searchProduct.svg'
import {Link} from "react-router-dom";


function App() {


    return (
        <>

            <div className="h-screen w-screen bg-gray-800 flex justify-center items-center gap-5 flex-wrap">
                <Link to={'/extractProduct'}>
                    <div
                        className="p-4 bg-blue-700 rounded-2xl flex justify-center items-center flex-col hover:bg-blue-700/40 group">
                        <img src={extractIcon} className=" w-3/5 group-hover:-translate-y-8 transition duration-500"
                             alt="extract"/>
                        <h1 className="text-slate-300 text-xl tracking-wide font-bold">Category Extract</h1>
                    </div>
                </Link>
                <Link to={'/priceChecker'}>
                    <div
                        className="p-4 bg-blue-700 rounded-2xl flex justify-center items-center flex-col hover:bg-blue-700/40 group">
                        <img src={PriceIcon} className=" w-3/5 group-hover:-translate-y-8 transition duration-500"
                             alt="extract"/>
                        <h1 className="text-slate-300 text-xl tracking-wide font-bold">CSV Price Checker</h1>
                    </div>
                </Link>
                <Link to={'/searchProduct'}>
                    <div
                        className="p-4 bg-blue-700 rounded-2xl flex justify-center items-center flex-col hover:bg-blue-700/40 group">
                        <img src={SearchProduct} className=" w-3/5 group-hover:-translate-y-8 transition duration-500"
                             alt="extract"/>
                        <h1 className="text-slate-300 text-xl tracking-wide font-bold">Search Product</h1>
                    </div>
                </Link>
            </div>
        </>
    )
}

export default App

