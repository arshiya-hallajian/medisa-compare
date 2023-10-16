import {Navbar} from "./components/Navbar.jsx";
import axios from "axios";
import {useState} from "react";
import {io} from "socket.io-client";
import Description from "./components/Description.jsx";
import {MultiProduct} from "./MultiProduct.jsx";
import {UpdateWindow} from "./components/UpdateWindow.jsx";
import {AddList} from "./components/AddList.jsx";
import {EachProduct} from "./components/EachProduct.jsx";
import Data from '../../assets/sampledata'
// import {useState} from "react";




const ExtractProduct = () => {
    const [fData, setFData] = useState([]);
    const [multip, setMultip] = useState({
        isOpen: false,
        data: []
    });
    const [addList, setAddList] = useState({
        isOpen: false,
        offer_price: null,
        data: null
    })
    const [updateWindow, setUpdateWindow] = useState({
        isOpen: false,
        data: null,
        offer_prices: {
            Neach : null,
            Vbox : null
        },
        each: null,
        box: null
    });
    const [desc, setDesc] = useState({
        isOpen: false,
        desc: '',
        spec: []
    });
    const [loader, setLoader] = useState({
        status: 0,
        number: 0,
        page: 0,
        total: 0,
        percent: 0
    });


    const getData = async (url) => {
        try {
            const socket = await io(import.meta.env.VITE_API2)
            // const res = await axios.get(`https://rhn9zs-8080.csb.app/?url=${url}`);
            const res = await axios.get(`${import.meta.env.VITE_API2}/api/extract/getAllProducts?url=${url}`)
            console.log(res.data)


            socket.on('connect', () => {
                console.log("connected")
            })

            socket.on('extract-loader', (data) => {
                console.log(data.data)
                if (data.status === "link") {
                    setLoader(prev => ({
                        ...prev,
                        status: 1,
                        page: data.page
                    }))
                }
                if (data.status === "loading") {
                    setFData(data.data)
                    setLoader(prev => ({
                        ...prev,
                        status: 2,
                        total: data.total,
                        number: data.number,
                        percent: Math.round((data.number / data.total) * 100)
                    }))
                }
            })
            socket.on('finished', () => {
                socket.disconnect()
                setLoader((prev) => ({
                    ...prev,
                    status: 0
                }))
                console.log('disconnected')
            })
        } catch (e) {
            console.log(e)
        }
    }

    const updateWindowHandler = (data, offerPrice, ind, each = null, box = null) => {
        setUpdateWindow(prev => ({
            ...prev,
            isOpen: true,
            data: data,
            offer_prices: offerPrice,
            indPrice: ind,
            each: each,
            box: box
        }))
    }
    const addListHandler = (data, offerPrice) => {
        setAddList(prev => ({
            ...prev,
            isOpen: true,
            data: data,
            offer_price: offerPrice
        }))
    }
    const multiProductHandler = (data) => {
        setMultip(prev => ({
            ...prev,
            isOpen: true,
            data: data
        }))
    }

    const desFunc = (des, spec) => {
        setDesc(prev => ({
            ...prev,
            isOpen: true,
            desc: des,
            spec: spec
        }))
        console.log(desc)
    }

    return (
        <div
            className="h-screen w-full overflow-auto bg-gray-700 relative scrollbar scrollbar-thin scrollbar-thumb-red-600">
            <Navbar click={getData}/>
            <Description data={desc} setData={setDesc}/>
            <MultiProduct data={multip} setData={setMultip} update={updateWindowHandler}/>
            <UpdateWindow data={updateWindow} setData={setUpdateWindow}/>
            <AddList data={addList} setData={setAddList}/>
            {

                loader.status === 2 &&
                <div className="mx-auto flex w-3/6 text-gray-200 mb-8">
                    <p>{`${loader.number}/${loader.total}`}</p>
                    <div className="mt-2 mb-4 ml-5 inline-flex w-full rounded-full bg-gray-200 h-2.5">
                        <div className="rounded-full bg-blue-600 h-2.5"
                             style={{"width": `${loader.percent}%`}}></div>
                    </div>
                </div>
            }
            {loader.status === 1 &&
                <div className="mx-auto w-3/6 text-gray-200 text-center text-red-500 font-bold mb-8">
                    {/*<p className="">{loader.number}/{loader.total}</p>*/}
                    <p>{`scrap links on page(${loader.page})`}</p>

                </div>

            }

            {
                Data[0] &&
                <div className="overflow-auto">
                    <table className="w-full border-separate border-spacing-y-2 text-slate-300">
                        <thead>
                        <tr>
                            <th className="border col-span-2" colSpan={5}>independence</th>
                            <th className="border" colSpan={5}>Medisa</th>
                        </tr>
                        <tr>
                            <th className="border">Name</th>
                            <th className="border px-1">Sku & Link</th>
                            <th className="border">mpn</th>
                            <th className="border">Stock</th>
                            <th className="border">Prices</th>
                            <th className="border">name</th>
                            <th className="border">Price</th>
                            <th className="border">sku</th>
                            <th className="border">update</th>
                        </tr>
                        </thead>
                        <tbody className="text-center">
                        {
                            Data.map((row, index) => {
                                return (
                                    <EachProduct key={index} row={row} desc={desFunc} multiP={multiProductHandler} listHandler={addListHandler} updateW={updateWindowHandler}/>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>
            }
        </div>
    )
}
export default ExtractProduct