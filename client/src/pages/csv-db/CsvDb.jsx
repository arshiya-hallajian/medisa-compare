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
    const [searchType, setSearchType] = useState("mpn")


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

            const result = await axios.get(`${import.meta.env.VITE_API}/api/csvSave/?s=${SearchInput}&type=${searchType}`)
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

                <div className="mb-14 text-white flex gap-4 justify-center items-center overflow-hidden">
                    <div
                        className={` w-screen transition duration-700 md:w-full justify-center items-center py-2 md:py-7 ${SearchMode ? "flex opacity-100 translate-x-0" : "hidden opacity-0  translate-x-[100rem] "}`}>
                        <div className="flex flex-col">
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
                            <div className="flex gap-5">
                                <div className={`cursor-pointer ${searchType === "mpn" ? "text-red-500" : ""}`} onClick={()=>setSearchType("mpn")}>mpn</div>
                                <div className={`cursor-pointer ${searchType === "mpn" ? "" : "text-red-500"}`} onClick={()=>setSearchType("brand")}>brand</div>
                            </div>
                        </div>
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
                                <th className="border" colSpan={6}>
                                    Medisa
                                </th>
                                <th className="border" colSpan={6}>
                                    independence(supplier)
                                </th>
                                <th className="border" colSpan={5}>
                                    teammed(supplier)
                                </th>
                                <th className="border" colSpan={5}>
                                    main(supplier)
                                </th>
                                <th className="border" colSpan={4}>
                                    bright sky(competitor)
                                </th>
                                <th className="border" colSpan={4}>
                                    joya medical(competitor)
                                </th>
                                <th className="border" colSpan={4}>
                                    alpha medical(competitor)
                                </th>
                                <th className="border" colSpan={4}>
                                    medshop(competitor)
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
                                <th className="border px-2">Serp rank</th>
                                <th className="border px-2">SKU</th>
                                <th className="border px-2">units in packaging</th>
                                <th className="border px-2">Stock</th>
                                <th className="border px-2">Price</th>
                                {/*ind*/}
                                <th className="border px-2">title</th>
                                <th className="border px-2">SKU</th>
                                <th className="border px-2">units in packaging</th>
                                <th className="border px-2">stock</th>
                                <th className="border px-2">sell price</th>
                                <th className="border px-2">buy price</th>
                                {/*teammed*/}
                                <th className="border px-2">title</th>
                                <th className="border px-2">units in packaging</th>
                                <th className="border px-2">stock</th>
                                <th className="border px-2">sell price</th>
                                <th className="border px-2">buy price</th>
                                {/*main supplier*/}
                                <th className="border px-2">title</th>
                                <th className="border px-2">units in packaging</th>
                                <th className="border px-2">stock</th>
                                <th className="border px-2">sell price</th>
                                <th className="border px-2">buy price</th>
                                {/*bright sky*/}
                                <th className="border px-2">title</th>
                                <th className="border px-2">stock</th>
                                <th className="border px-2">units in packaging</th>
                                <th className="border px-2">price</th>
                                {/*joya medical*/}
                                <th className="border px-2">title</th>
                                <th className="border px-2">stock</th>
                                <th className="border px-2">units in packaging</th>
                                <th className="border px-2">price</th>
                                {/*alpha medical*/}
                                <th className="border px-2">title</th>
                                <th className="border px-2">stock</th>
                                <th className="border px-2">units in packaging</th>
                                <th className="border px-2">price</th>
                                {/*med shop*/}
                                <th className="border px-2">title</th>
                                <th className="border px-2">stock</th>
                                <th className="border px-2">units in packaging</th>
                                <th className="border px-2">price</th>
                            </tr>
                            </thead>
                            <tbody className="text-center">
                            {data ? data.map((row, index) => {
                                return (
                                    <tr key={index}>

                                        <td className="border w-48 h-20">
                                            <p>{row.mpn_image &&
                                                <img className="rounded-xl w-full h-full " src={row.mpn_image}
                                                     alt="product"/>}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.mpn_channel && row.mpn_channel}</p>
                                        </td>
                                        <td className="border">
                                            <ul className="list-decimal list-inside">
                                                {row.mpn_mpns.length > 0 && row.mpn_mpns.map((eachMpn, i) => {
                                                        if (eachMpn) {
                                                            return (
                                                                <li className="w-32" key={i}>{eachMpn}</li>
                                                            )
                                                        }
                                                    }
                                                )}
                                            </ul>

                                        </td>
                                        <td className="border px-3">
                                            <p>{row.mpn_status && row.mpn_status}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.mpn_changeDate ? row.mpn_changeDate : "---"}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.mpn_gst && row.mpn_gst}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.company_uom && row.company_uom}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.company_unitsPack && row.company_unitsPack}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.company_packsCarton && row.company_packsCarton}</p>
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
                                            <a className="underline text-blue-400"
                                               href={row.medisa_url ? row.medisa_url : "#"} target="_blank"
                                               rel="noopener noreferrer">
                                                <p className="break-words line-clamp-3 w-[300px]">{row.medisa_title && row.medisa_title}</p>
                                            </a>
                                        </td>

                                        <td className="border">
                                            <p>{row.medisa_serpRank && row.medisa_serpRank}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.medisa_sku && row.medisa_sku}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.medisa_unitInPackaging && row.medisa_unitInPackaging}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.medisa_stock && row.medisa_stock}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.medisa_price && row.medisa_price}</p>
                                        </td>

                                        {/*independence*/}
                                        <td className="border bg-gray-700 overflow-hidden ">
                                            <a className="underline text-blue-400"
                                               href={row.ind_url ? row.ind_url : "#"} target="_blank"
                                               rel="noopener noreferrer">
                                                <p className="break-words line-clamp-3 w-[300px]">{row.ind_title && row.ind_title}</p>
                                            </a>
                                        </td>

                                        <td className="border">
                                            <p>{row.ind_sku && row.ind_sku}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.ind_uip && row.ind_uip}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.ind_stock && row.ind_stock}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.ind_sellPrice && row.ind_sellPrice}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.ind_buyPrice && row.ind_buyPrice}</p>
                                        </td>

                                        {/*teammed*/}
                                        <td className="border bg-gray-700 overflow-hidden ">
                                            <a className="underline text-blue-400"
                                               href={row.teammed_url ? row.teammed_url : "#"} target="_blank"
                                               rel="noopener noreferrer">
                                                <p className="break-words line-clamp-3 w-[300px]">{row.teammed_title && row.teammed_title}</p>
                                            </a>
                                        </td>

                                        <td className="border">
                                            <p>{row.teammed_uip && row.teammed_uip}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.teammed_stock && row.teammed_stock}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.teammed_sellPrice && row.teammed_sellPrice}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.teammed_buyPrice && row.teammed_buyPrice}</p>
                                        </td>


                                        {/*main supplier*/}
                                        <td className="border bg-gray-700 overflow-hidden ">
                                            <a className="underline text-blue-400"
                                               href={row.main_url ? row.main_url : "#"} target="_blank"
                                               rel="noopener noreferrer">
                                                <p className="break-words line-clamp-3 w-[300px]">{row.main_title && row.main_title}</p>
                                            </a>
                                        </td>

                                        <td className="border">
                                            <p>{row.main_uip && row.main_uip}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.main_stock && row.main_stock}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.main_sellPrice && row.main_sellPrice}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.main_buyPrice && row.main_buyPrice}</p>
                                        </td>


                                        {/*bright sky*/}
                                        <td className="border bg-gray-700 overflow-hidden ">
                                            <a className="underline text-blue-400"
                                               href={row.brightSky_url ? row.brightSky_url : "#"} target="_blank"
                                               rel="noopener noreferrer">
                                                <p className="break-words line-clamp-3 w-[300px]">{row.brightSky_title && row.brightSky_title}</p>
                                            </a>
                                        </td>
                                        <td className="border">
                                            <p>{row.brightSky_uip && row.brightSky_uip}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.brightSky_stock && row.brightSky_stock}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.brightSky_price && row.brightSky_price}</p>
                                        </td>

                                        {/*joya medical*/}
                                        <td className="border bg-gray-700 overflow-hidden ">
                                            <a className="underline text-blue-400"
                                               href={row.joya_url ? row.joya_url : "#"} target="_blank"
                                               rel="noopener noreferrer">
                                                <p className="break-words line-clamp-3 w-[300px]">{row.joya_title && row.joya_title}</p>
                                            </a>
                                        </td>
                                        <td className="border">
                                            <p>{row.joya_uip && row.joya_uip}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.joya_stock && row.joya_stock}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.joya_price && row.joya_price}</p>
                                        </td>

                                        {/*alpha medical*/}
                                        <td className="border bg-gray-700 overflow-hidden ">
                                            <a className="underline text-blue-400"
                                               href={row.alpha_url ? row.alpha_url : "#"} target="_blank"
                                               rel="noopener noreferrer">
                                                <p className="break-words line-clamp-3 w-[300px]">{row.alpha_title && row.alpha_title}</p>
                                            </a>
                                        </td>
                                        <td className="border">
                                            <p>{row.alpha_uip && row.alpha_uip}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.alpha_stock && row.alpha_stock}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.alpha_price && row.alpha_price}</p>
                                        </td>

                                        {/*med shop*/}
                                        <td className="border bg-gray-700 overflow-hidden ">
                                            <a className="underline text-blue-400"
                                               href={row.medShop_url ? row.medShop_url : "#"} target="_blank"
                                               rel="noopener noreferrer">
                                                <p className="break-words line-clamp-3 w-[300px]">{row.medShop_title && row.medShop_title}</p>
                                            </a>
                                        </td>
                                        <td className="border">
                                            <p>{row.medShop_uip && row.medShop_uip}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.medShop_stock && row.medShop_stock}</p>
                                        </td>
                                        <td className="border">
                                            <p>{row.medShop_price && row.medShop_price}</p>
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