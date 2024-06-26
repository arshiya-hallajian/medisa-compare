import Confirm from "./Confirm.jsx";
import {toast, ToastContainer} from "react-toastify";
import {useState} from "react";
import axios from "axios";
import {io} from "socket.io-client";

const PriceScrap = () => {
    const [file,setFile] = useState(null)
    const [data,setData] = useState(null)
    const [loader,setLoader] = useState(null)
    const [isConfirm, setIsConfirm] = useState({isOpen:false,single:false,index:null})
    const [inputSelected,setInputSelected] = useState([])



    const onSubmitHandler = async (e) => {
        e.preventDefault();
        console.log(file);
        const formData = new FormData();
        formData.append("csv", file[0])
        try{
            toast.info("Receiving Data..", { autoClose: false , toastId:85,position: "bottom-right", });


            // loaderSystem()
            const res = await axios.post(`${import.meta.env.VITE_API}/api/pricing/csv`,formData);


            if(res.status === 200){

                toast.update(85, {
                    render: "Done",
                    type: toast.TYPE.SUCCESS,
                    autoClose: 5000 ,
                    position: "bottom-right",
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                // console.log(res.data)
                const socket = io(`${import.meta.env.VITE_API2}`)

                const mpn = res.data;
                const total = mpn.length;
                setLoader(1)

                console.log(mpn)
                socket.emit('mpns',{array: res.data})

                socket.on('loader', (loadData) =>{
                    console.log("loader lunched",loadData.count,"/",total)
                    const percent = Math.round((loadData.count / total)*100)
                    setLoader(percent)
                    // setData()
                    if(loadData.count === total){
                        setTimeout(() => {
                            setLoader(null)



                        }, 2000);
                    }
                });

                socket.on('data',(data)=>{

                    setData(data.data)
                    console.log(data.data)

                    socket.disconnect()
                    console.log('socket disconnected')
                })


            }

        }catch(e){

            console.log(e)
            toast.update(85, {
                render: "Error Please Try again",
                type: toast.TYPE.ERROR,
                autoClose: 5000 ,
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


    const handleUpdate = async (sku,price) => {

        if(sku){
            console.log(sku,price)
            try{
                toast.info("Updating ...", { autoClose: false , toastId:80,position: "bottom-right" });
                setIsConfirm({isOpen:false,single:false,index:null})
                const res = await axios.get(`${import.meta.env.VITE_API2}/api/pricing/updateProduct/${sku}?price=${price}`)
                if(res.status === 200){
                    console.log(res)
                    toast.update(80, {
                        render: "Updated",
                        type: toast.TYPE.SUCCESS,
                        autoClose: 5000 ,
                        position: "bottom-right",
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                }

            }catch(e){
                console.log(e)
                toast.update(80, {
                    render: "Error Please Try again",
                    type: toast.TYPE.ERROR,
                    autoClose: 5000 ,
                    position: "bottom-right",
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        }else{
            toast.update(80, {
                render: "Error Please Try again",
                type: toast.TYPE.ERROR,
                autoClose: 5000 ,
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

    const handleOnChange = (e) => {
        setFile(e.target.files)
        console.log(e.target.files)
    }


    const handleFormSubmit = async(e) => {
        e.preventDefault()
        console.log(inputSelected,"submited")
        if(inputSelected.length === 0){
            return console.log("you didnt select anything")
        }
        try{
            toast.info("Updating ...", { autoClose: false , toastId:90,position: "bottom-right" });
            const res = await axios.post(`${import.meta.env.VITE_API2}/api/pricing/UpdateBatchProduct`, inputSelected);
            console.log(res.data)
            setInputSelected([])
            toast.update(90, {
                render: "Updated",
                type: toast.TYPE.SUCCESS,
                autoClose: 5000 ,
                position: "bottom-right",
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

        }catch(e){
            console.log(e)
            toast.update(90, {
                render: "Error Please Try again",
                type: toast.TYPE.ERROR,
                autoClose: 5000 ,
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


    const handleFormChange = (sku,price) => {
        if(inputSelected.some(each => each.sku === sku)){
            setInputSelected(inputSelected.filter(each => each.sku !== sku))
        }else{
            setInputSelected([...inputSelected,{sku: sku, price: price}])
        }
    }


    return (
        <div className={`h-screen w-[200%] md:w-full overflow-x-auto bg-slate-800 relative `}>
            {/* <div> */}
            {
                isConfirm.isOpen && <Confirm
                    close={() => setIsConfirm({isOpen: false, single: false, index: null})}
                    data={{data, isConfirm}}
                    confirm={handleUpdate}
                />
            }
            {/* <ClickOut  show={isConfirm.isOpen} onClickOutside={() => setIsConfirm({isOpen:false,single:false,index:null})} />
    </div> */}
            <div
                className={`${isConfirm.isOpen && "blur-sm"} h-screen w-full md:w-full overflow-x-auto flex flex-col items-center gap-2 pt-10`}>
                <ToastContainer/>
                <div className="text-white flex gap-4">
                    <p>please the csv of mpn here:</p>
                    <form onSubmit={onSubmitHandler}>
                        <input type="file" accept=".csv" name="file" onChange={handleOnChange}/>
                        <input type="submit" value="start searching"
                               className="bg-orange-500 hover:bg-orange-400/70 rounded-lg py-2 px-5 text-white mb-20"/>
                    </form>
                </div>

                {loader && <div className="flex w-3/6 text-gray-200">
                    <p className="">{loader}%</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 mt-2 ml-5 inline-flex">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{"width": `${loader}%`}}></div>
                    </div>
                </div>}


                {data && <>
                    <table
                        className="my-10 w-5/6 min-h-20 h-20 text-center table-fixed border-separate border-spacing-y-1 border text-white border-gray-200">
                        <thead className="bg-gray-600">
                        <tr>
                            <th>NAMES</th>
                            <th className="truncate">{import.meta.env.VITE_COMP_SITE}</th>
                            <th className="truncate">{import.meta.env.VITE_DEF_SITE}</th>
                            <th>New Price</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data ? data.map((code, index) => {
                            let color

                            if ((code.Dprice[0] && code.Cprice[0] < code.Dprice[0].price) || (code.Dprice[1] && code.Cprice[1] < code.Dprice[1].price)) {
                                color = "bg-red-700"
                            } else {
                                color = "bg-green-700"
                            }

                            let singlePrice = (code.Cprice[0] - 1 / 100).toFixed(2);
                            let boxPrice = (code.Cprice[1] - 2 / 100).toFixed(2);

                            return (
                                <tr className={color} key={index}>
                                    <td className="bg-gray-700 overflow-hidden w-[300px]">
                                        <p className="break-words line-clamp-2">{code.Name}</p>
                                    </td>
                                    <td>
                                        <p>price for single: ${code.Cprice[0] ? code.Cprice[0] : "null"}</p>
                                        <p>price for Box: ${code.Cprice[1] ? code.Cprice[1] : "null"}</p>
                                    </td>
                                    <td>
                                        <p>price for singe: ${code.Dprice[0] ? code.Dprice[0].price : "null"}</p>
                                        <p>price for Box: ${code.Dprice[1] ? code.Dprice[1].price : "null"}</p>
                                    </td>
                                    <td className="p-2 flex gap-3 justify-center items-center">
                                        <div>
                                            <div
                                                className={`cursor-pointer ${code.Dprice[0] ? "bg-orange-500" : "bg-gray-500/70"} rounded-lg px-3`}
                                                onClick={() => setIsConfirm({
                                                    isOpen: true,
                                                    single: true,
                                                    index: index
                                                })}>
                                                <p>single : {singlePrice} </p>
                                            </div>
                                            <div
                                                className={`cursor-pointer ${code.Dprice[1] ? "bg-orange-500" : "bg-gray-500/70"} rounded-lg mt-4 px-3`}
                                                onClick={() => setIsConfirm({
                                                    isOpen: true,
                                                    single: false,
                                                    index: index
                                                })}>
                                                <p>Box : {boxPrice} </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            <label htmlFor="">
                                                <input type="checkbox" disabled={!code.Dprice[0]}
                                                       checked={code.Dprice[0] && inputSelected.some(each => each.sku === code.Dprice[0].sku)}
                                                       onChange={() => handleFormChange(code.Dprice[0].sku, singlePrice)}
                                                       className="h-6 w-6 border rounded-xl"/>
                                            </label>
                                            <label htmlFor="">
                                                <input type="checkbox" disabled={!code.Dprice[1]}
                                                       checked={code.Dprice[1] && inputSelected.some(each => each.sku === code.Dprice[1].sku)}
                                                       onChange={() => handleFormChange(code.Dprice[1].sku, boxPrice)}
                                                       className="h-6 w-6 border rounded-xl"/>
                                            </label>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }) : <tr>
                            <td>there is nothing to show</td>
                            <td>there is nothing to show</td>
                            <td>there is nothing to show</td>
                            <td>there is nothing to show</td>
                        </tr>}

                        </tbody>
                    </table>
                    {inputSelected.length !== 0 && <div className="flex gap-6">
                        <button onClick={handleFormSubmit}
                                className="bg-orange-500 rounded-lg py-2 px-5 text-white mb-20">
                            Update All Selected
                        </button>
                    </div>}
                </>}
            </div>
        </div>
    )
}

export default PriceScrap