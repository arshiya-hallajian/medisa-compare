import {Navbar} from "./components/Navbar.jsx";
import {useState} from "react";


const ExtractProduct = () => {
    const [loader, setLoader] = useState(20);

    return (
        <div className="w-screen max-w-full bg-gray-700 h-screen">
            <Navbar/>
            <div className="flex w-3/6 mx-auto text-gray-200">
                <p className="">{loader}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 mt-2 ml-5 inline-flex">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{"width": `${loader}%`}}></div>
                </div>
            </div>

        </div>

    )
}
    export default ExtractProduct