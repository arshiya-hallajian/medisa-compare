import {useState} from "react";
import {Button, Modal} from "flowbite-react";
import {toast} from "react-toastify";
import axios from "axios";


const SimpleView = ({data}) => {
    const [inputSelected, setInputSelected] = useState([])
    const [SearchType, setSearchType] = useState([])
    const [checkAllState, setCheckAllState] = useState(false)
    const [openModal, setOpenModal] = useState(false)


    const handleSearchType = (type) => {
        if (SearchType.some(each => each === type)) {
            setSearchType(SearchType.filter(each => each !== type))
        } else {
            setSearchType([...SearchType, type])
        }
    }

    const handleFormChange = (sku) => {
        if (inputSelected.some(each => each === sku)) {
            setInputSelected(inputSelected.filter(each => each !== sku))
        } else {
            setInputSelected([...inputSelected, sku])
        }
    }

    const handleOnSubmit = () => {
        setOpenModal(false)
        console.log(SearchType)
        console.log(inputSelected)
        try{
            toast.promise(
                axios.put(`${import.meta.env.VITE_API}/api/csvSave/update`,{searchType:SearchType, skus:inputSelected}),
                {
                    success:"updated successfully",
                    error:"error happened",
                    pending:"updating...."
                }
            )
        }catch (e) {
            toast.warning("error happend in update")
        }
    }


    const checkAll = () => {
        const skus = data.map(item => item.medisa_sku)
        setInputSelected(skus)
        setCheckAllState(true)
    }

    const unCheckAll = () => {
        setInputSelected([])
        setCheckAllState(false)
    }


    return (
        <>
            {inputSelected.length > 0 && <div className="flex justify-center items-center mb-5">
                <div onClick={() => setOpenModal(true)}
                     className="px-4 py-2 bg-amber-400 cursor-pointer rounded-xl">update
                </div>
            </div>}

            <Modal show={openModal} size="xl" onClose={() => setOpenModal(false)}>
                <Modal.Header>Do you want to update these skus in {SearchType.map((type)=><p className="text-red-500">{type}</p>)}?</Modal.Header>
                <Modal.Body>
                    {inputSelected.map((sku,index) => {
                        return (
                            <p key={index}>{sku}</p>
                        )
                    })}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleOnSubmit}>Ok</Button>
                    <Button color="gray" onClick={() => setOpenModal(false)}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className="overflow-auto scrollbar-thin">
                <table className="w-full border-collapse text-slate-300">
                    <thead>
                    <tr>
                        <th className="border px-4">
                            {!checkAllState ?
                                <div className="px-2 py-1 bg-amber-400 text-xs text-black rounded-xl cursor-pointer"
                                     onClick={checkAll}>Check All</div>
                                :
                                <div className="px-2 py-1 bg-amber-400 text-xs text-black rounded-xl cursor-pointer"
                                     onClick={unCheckAll}>unCheck All</div>
                            }
                        </th>
                        <th className="border px-6 border-r-4 border-r-red-500" colSpan={2}>
                            MPN
                        </th>
                        <th className="border px-6 border-r-4 border-r-red-500" colSpan={3}>
                            <input type="checkbox" className="h-4 w-4 border rounded-xl mr-3"
                                   checked={SearchType.some(each => each === "Medisa")}
                                   onChange={() => handleSearchType("Medisa")}
                            />
                            Medisa
                        </th>
                        <th className="border px-6 border-r-4 border-r-red-500" colSpan={4}>
                            <input type="checkbox" className="h-4 w-4 border rounded-xl mr-3"
                                   checked={SearchType.some(each => each === "Independence")}
                                   onChange={() => handleSearchType("Independence")}
                            />
                            independence(supplier)
                        </th>
                        <th className="border px-6 border-r-4 border-r-red-500" colSpan={3}>
                            <input type="checkbox" className="h-4 w-4 border rounded-xl mr-3"
                                   checked={SearchType.some(each => each === "Teammed")}
                                   onChange={() => handleSearchType("Teammed")}
                            />
                            teammed(supplier)
                        </th>
                        <th className="border px-6 border-r-4 border-r-red-500" colSpan={3}>
                            <input type="checkbox" className="h-4 w-4 border rounded-xl mr-3"
                                   checked={SearchType.some(each => each === "Main")}
                                   onChange={() => handleSearchType("Main")}
                            />
                            main(supplier)
                        </th>
                        <th className="border px-6 border-r-4 border-r-red-500" colSpan={2}>
                            <input type="checkbox" className="h-4 w-4 border rounded-xl mr-3"
                                   checked={SearchType.some(each => each === "BrightSky")}
                                   onChange={() => handleSearchType("BrightSky")}
                            />
                            bright sky(competitor)
                        </th>
                        <th className="border px-6 border-r-4 border-r-red-500" colSpan={2}>
                            <input type="checkbox" className="h-4 w-4 border rounded-xl mr-3"
                                   checked={SearchType.some(each => each === "JoyaMedical")}
                                   onChange={() => handleSearchType("JoyaMedical")}
                            />
                            joya medical(competitor)
                        </th>
                        <th className="border px-6 border-r-4 border-r-red-500" colSpan={2}>
                            <input type="checkbox" className="h-4 w-4 border rounded-xl mr-3"
                                   checked={SearchType.some(each => each === "AlphaMedical")}
                                   onChange={() => handleSearchType("AlphaMedical")}
                            />
                            alpha medical(competitor)
                        </th>
                        <th className="border px-6 border-r-4 border-r-red-500" colSpan={2}>
                            <input type="checkbox" className="h-4 w-4 border rounded-xl mr-3"
                                   checked={SearchType.some(each => each === "Medshop")}
                                   onChange={() => handleSearchType("Medshop")}
                            />
                            medshop(competitor)
                        </th>
                    </tr>
                    <tr className="text-lg whitespace-nowrap">
                        <th></th>
                        <th className="border px-2">mpns</th>
                        <th className="border px-2 border-r-4 border-r-red-500">status</th>
                        {/*medisa*/}
                        <th className="border px-2">SKU</th>
                        <th className="border px-2">Stock</th>
                        <th className="border px-2 border-r-4 border-r-red-500">Price</th>

                        {/*ind*/}
                        <th className="border px-2">SKU</th>
                        <th className="border px-2">stock</th>
                        <th className="border px-2">sell price</th>
                        <th className="border px-2 border-r-4 border-r-red-500">buy price</th>
                        {/*teammed*/}
                        <th className="border px-2">stock</th>
                        <th className="border px-2">sell price</th>
                        <th className="border px-2 border-r-4 border-r-red-500">buy price</th>
                        {/*main supplier*/}
                        <th className="border px-2">stock</th>
                        <th className="border px-2">sell price</th>
                        <th className="border px-2 border-r-4 border-r-red-500">buy price</th>
                        {/*bright sky*/}
                        <th className="border px-2">stock</th>
                        <th className="border px-2 border-r-4 border-r-red-500">price</th>
                        {/*joya medical*/}
                        <th className="border px-2">stock</th>
                        <th className="border px-2 border-r-4 border-r-red-500">price</th>
                        {/*alpha medical*/}
                        <th className="border px-2">stock</th>
                        <th className="border px-2 border-r-4 border-r-red-500">price</th>
                        {/*med shop*/}
                        <th className="border px-2">stock</th>
                        <th className="border px-2 border-r-4 border-r-red-500">price</th>
                    </tr>
                    </thead>
                    <tbody className="text-center">
                    {data ? data.map((row, index) => {
                        return (
                            <tr key={index}>
                                <td className="border flex justify-center py-2">
                                    <input
                                        className="h-5 w-5 rounded border"
                                        type="checkbox"
                                        checked={inputSelected.some(each => each === row.medisa_sku)}
                                        onChange={() => handleFormChange(row.medisa_sku)}
                                    />
                                </td>
                                <td className="border ">
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
                                <td className="border px-3 border-r-4 border-r-red-500">
                                    <p>{row.mpn_status && row.mpn_status}</p>
                                </td>
                                <td className="border">
                                    <p>{row.medisa_sku && row.medisa_sku}</p>
                                </td>
                                <td className="border">
                                    <p>{row.medisa_stock && row.medisa_stock}</p>
                                </td>
                                <td className="border border-r-4 border-r-red-500">
                                    <p>{row.medisa_price && row.medisa_price}</p>
                                </td>
                                {/*independence*/}

                                <td className="border">
                                    <p>{row.ind_sku && row.ind_sku}</p>
                                </td>
                                <td className="border">
                                    <p>{row.ind_stock && row.ind_stock}</p>
                                </td>
                                <td className="border">
                                    <p>{row.ind_sellPrice && row.ind_sellPrice}</p>
                                </td>
                                <td className="border border-r-4 border-r-red-500">
                                    <p>{row.ind_buyPrice && row.ind_buyPrice}</p>
                                </td>
                                {/*teammed*/}
                                <td className="border">
                                    <p>{row.teammed_stock && row.teammed_stock}</p>
                                </td>
                                <td className="border">
                                    <p>{row.teammed_sellPrice && row.teammed_sellPrice}</p>
                                </td>
                                <td className="border border-r-4 border-r-red-500">
                                    <p>{row.teammed_buyPrice && row.teammed_buyPrice}</p>
                                </td>
                                {/*main supplier*/}
                                <td className="border">
                                    <p>{row.main_stock && row.main_stock}</p>
                                </td>
                                <td className="border">
                                    <p>{row.main_sellPrice && row.main_sellPrice}</p>
                                </td>
                                <td className="border border-r-4 border-r-red-500">
                                    <p>{row.main_buyPrice && row.main_buyPrice}</p>
                                </td>


                                {/*bright sky*/}

                                <td className="border">
                                    <p>{row.brightSky_stock && row.brightSky_stock}</p>
                                </td>
                                <td className="border border-r-4 border-r-red-500">
                                    <p>{row.brightSky_price && row.brightSky_price}</p>
                                </td>

                                {/*joya medical*/}

                                <td className="border">
                                    <p>{row.joya_stock && row.joya_stock}</p>
                                </td>
                                <td className="border border-r-4 border-r-red-500">
                                    <p>{row.joya_price && row.joya_price}</p>
                                </td>

                                {/*alpha medical*/}

                                <td className="border">
                                    <p>{row.alpha_stock && row.alpha_stock}</p>
                                </td>
                                <td className="border border-r-4 border-r-red-500">
                                    <p>{row.alpha_price && row.alpha_price}</p>
                                </td>

                                {/*med shop*/}

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
            </div>
        </>
    )
}


export default SimpleView