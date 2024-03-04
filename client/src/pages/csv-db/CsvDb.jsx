import Confirm from "../priceScrap/Confirm.jsx";
import {toast, ToastContainer} from "react-toastify";
import {useState} from "react";
import axios from "axios";
import {ArchiveBoxIcon, MagnifyingGlassCircleIcon} from "@heroicons/react/24/solid";
import {MagnifyingGlassIcon} from "@heroicons/react/24/solid/index.js";
import {Suppliers} from "./Suppliers.jsx";
import {Competitors} from "./Competitors.jsx";
import {io} from "socket.io-client";


export const CsvDb = () => {
    const [file, setFile] = useState(null)
    const [data, setData] = useState(null)
    const [SearchInput, setSearchInput] = useState(null)
    const [SearchMode, setSearchMode] = useState(false)
    const [competitor, setCompetitor] = useState({
        isOpen: false,
        data: null
    })
    const [suppliers, setSuppliers] = useState({
        isOpen: false,
        data: null,
    })


    const onFileSubmitHandler = async (e) => {
        e.preventDefault();
        console.log(file);
        const formData = new FormData();
        formData.append("csv", file[0])
        try {
            toast.info("Receiving Data..", {autoClose: false, toastId: 85, position: "bottom-right"});


            // const socket = await io(import.meta.env.VITE_API)

            const res = await axios.post(`${import.meta.env.VITE_API}/api/csvSave/`, formData);

            // socket.on('connect', () => {
            //     console.log("connected")
            // })

            if (res.status === 200) {
                setData(res.data)
                toast.update(85, {
                    render: "Done",
                    type: toast.TYPE.SUCCESS,
                    autoClose: 5000,
                    position: "bottom-right",
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                console.log(res.data)
            }

        } catch (e) {
            console.log(e)
            toast.update(85, {
                render: "Error Please Try again",
                type: toast.TYPE.ERROR,
                autoClose: 5000,
                position: "bottom-right",
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }

    }


    const onSearchChange = (e) => {
        setSearchInput(e.target.value)
    }


    const handleFileOnChange = (e) => {
        setFile(e.target.files)
        console.log(e.target.files)
    }


    const onSearchSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            toast.info("Receiving Data..", {autoClose: false, toastId: 84, position: "bottom-right",});

            const result = await axios.get(`${import.meta.env.VITE_API}/api/csvSave/?s=${SearchInput}`)
            console.log(result.data)
            setData(result.data)
            toast.update(84, {
                render: "Done",
                type: toast.TYPE.SUCCESS,
                autoClose: 5000,
                position: "bottom-right",
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } catch (e) {
            toast.update(84, {
                render: "Error Please Try again",
                type: toast.TYPE.ERROR,
                autoClose: 5000,
                position: "bottom-right",
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            console.log("error in search database : " + e)
        }
    }


    return (
        <div className={`h-screen w-[200%] md:w-full overflow-x-auto bg-slate-800 relative `}>

            <div
                className={`h-screen w-full overflow-auto bg-gray-700 relative scrollbar-thin scrollbar-thumb-red-600 pt-10`}>
                <ToastContainer/>
                {suppliers.isOpen && <Suppliers suppliers={setSuppliers}/>}
                {competitor.isOpen && <Competitors competitors={setCompetitor}/>}
                <div className="mb-14 text-white flex gap-4 justify-center items-center overflow-hidden">

                    <div
                        className={` w-screen transition duration-700 md:w-full justify-center items-center py-2 md:py-7 ${SearchMode ? "flex opacity-100 translate-x-0" : "hidden opacity-0  translate-x-[100rem] "}`}>
                        <form onSubmit={onSearchSubmitHandler}>
                            <div className="flex bg-white rounded-full overflow-hidden">
                                <input type="text" onChange={onSearchChange}
                                       className=" md:w-96 px-3 border-0 outline-none text-black" name="search"
                                       placeholder="search your product here"/>
                                <button
                                    className="bg-amber-400 rounded-full text-black p-1 md:p-2 transition hover:scale-125 hover:animate-pulse active:bg-amber-600">
                                    <MagnifyingGlassIcon className="w-8"/>
                                </button>
                            </div>
                        </form>
                        <ArchiveBoxIcon
                            className={` ml-4 flex-none h-12 w-12 transition duration-700 ${SearchMode ? "block opacity-100 " : "hidden opacity-0 translate-x-[100rem]"}`}
                            onClick={() => setSearchMode(false)}/>
                    </div>
                    <MagnifyingGlassCircleIcon
                        className={`h-12 w-12 transition duration-500 opacity-100 ${SearchMode ? "opacity-0 translate-x-[100rem] hidden" : "block opacity-100"}`}
                        onClick={() => setSearchMode(true)}/>
                    <div
                        className={`transition duration-700 flex justify-center items-center gap-5 ${!SearchMode ? "opacity-100" : "opacity-0 hidden translate-x-[1000rem]"}`}>
                        <form onSubmit={onFileSubmitHandler} className="flex justify-center items-center gap-3 ">
                            <p>please the csv of mpn here:</p>
                            <input type="file" className="w-52" accept=".csv" name="file"
                                   onChange={handleFileOnChange}/>
                            <input type="submit" value="start Reading"
                                   className="bg-orange-500 hover:bg-orange-400/70 rounded-lg py-2 px-5 text-white "/>
                        </form>
                    </div>

                </div>


                {data &&
                    <div className="overflow-auto scrollbar-thin">
                        <table className="w-full border-collapse text-slate-300">
                            <thead>
                            <tr>
                                <th className="border" colSpan={6}>
                                    MPN
                                </th>

                                <th className="border" colSpan={6}>
                                    Company info
                                </th>
                                <th className="border" colSpan={7}>
                                    Medisa
                                </th>

                            </tr>
                            <tr className="text-lg whitespace-nowrap">
                                <th className="border px-2">image</th>
                                <th className="border px-2">channel</th>
                                <th className="border px-2">mpns</th>
                                <th className="border px-2">status</th>
                                <th className="border px-2">change date</th>
                                <th className="border px-2">gst</th>
                                {/*company info*/}
                                <th className="border px-2">uom</th>
                                <th className="border px-2">units pack</th>
                                <th className="border px-2">packs carton</th>
                                <th className="border px-2">company name</th>
                                <th className="border px-2">company brand</th>
                                <th className="border px-2">company abbreviation</th>
                                {/*medisa*/}
                                <th className="border px-2">title</th>
                                <th className="border px-2">url</th>
                                <th className="border px-2">Serp rank</th>
                                <th className="border px-2">SKU</th>
                                <th className="border px-2">units in packaging</th>
                                <th className="border px-2">Stock</th>
                                <th className="border px-2">Price</th>
                                <th className="border px-2">suppliers</th>
                                <th className="border px-2">competitors</th>
                            </tr>
                            </thead>
                            <tbody className="text-center">
                            {data ? data.map((row, index) => {
                                return (
                                    <tr key={index}>

                                        <td className="border w-48 h-20">
                                            <p>{row.image && <img className="rounded-xl w-full h-full " src={row.image}
                                                                  alt="product"/>}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.channel && row.channel}</p>
                                        </td>
                                        <td className="border">
                                            <ul className="list-decimal list-inside">
                                                {row.mpns.length > 0 && row.mpns.map((eachMpn, i) => {
                                                    if(eachMpn){
                                                        return (
                                                            <li className="w-32" key={i}>{eachMpn}</li>
                                                        )
                                                    }
                                                    }
                                                )}
                                            </ul>

                                        </td>
                                        <td className="border px-3">
                                            <p>{row.status && row.status}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.changeDate ? row.changeDate : "---"}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.gst && row.gst}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.uom && row.uom}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.unitsPack && row.unitsPack}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.packsCarton && row.packsCarton}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row['company_name'] && row['company_name']}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row['company_brand'] && row['company_brand']}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row['company_abbreviation'] && row['company_abbreviation']}</p>
                                        </td>

                                        <td className="border bg-gray-700 overflow-hidden ">
                                            <p className="break-words line-clamp-3 w-[300px]">{row.title}</p>
                                        </td>

                                        <td className="border ">
                                            <a className="flex justify-center" target="_blank" rel="noopener noreferrer"
                                               href={row.Medisa_url ? row.Medisa_url : "#"}><p
                                                className="px-2 w-24 py-1 my-2 bg-amber-500 text-white rounded-xl">Click
                                                Here</p></a>
                                        </td>
                                        <td className="border">
                                            <p>{row.serpRank && row.serpRank}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.sku && row.sku}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.unitInPackaging && row.unitInPackaging}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.stock && row.stock}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.price && row.price}</p>
                                        </td>

                                        <td className="border">
                                            <button onClick={() => setSuppliers({
                                                ...suppliers,
                                                isOpen: true,
                                                data: row.suppliers
                                            })} className="px-2 py-1 my-2 bg-amber-500 text-white rounded-xl">Click Here
                                            </button>
                                            {/*{row.suppliers && row.suppliers}*/}
                                        </td>
                                        <td className="border">
                                            <button onClick={() => setCompetitor({
                                                ...competitor,
                                                isOpen: true,
                                                data: row.competitors
                                            })} className="px-2 py-1 my-2 bg-amber-500 text-white rounded-xl">Click Here
                                            </button>
                                            {/*<p>{row.competitors && row.competitors}</p>*/}
                                        </td>
                                    </tr>
                                )
                            }) : <tr>
                                <td colSpan={21}>there is nothing to show</td>
                            </tr>}
                            </tbody>
                        </table>
                    </div>}
            </div>
        </div>
    )
}