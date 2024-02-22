import {useState} from "react";
import {RiseLoader} from "react-spinners";

export const Competitors = ({competitors}) => {
    const [data, setData] = useState({
        history: null
    })
    const [loading, setLoading] = useState(false)

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             setLoading(true)
    //             const res = await axios.get(`${import.meta.env.VITE_API}/api/`)
    //             setData(res.data)
    //
    //             setLoading(false)
    //         } catch (e) {
    //             setLoading(false)
    //             console.log(e.message, "error in fetching data in suppliers")
    //         }
    //     }
    //     fetchData()
    // }, []);

    return (
        <div
            className={`z-10 w-full md:w-11/12 h-5/6 flex flex-col fixed top-1/2 left-1/2 -translate-y-1/2 rounded-2xl p-10 bg-gray-800 text-white -translate-x-1/2`}>
            {loading ?
                <div className="h-full flex flex-auto justify-center items-center">
                    <RiseLoader color="#ff7d00"/>
                </div>
                :
                <>
                    <div className="mb-7 flex-1">
                        <table className="w-full">
                            <thead>
                            <tr>
                                <th colSpan={3} className="border">Bright Sky</th>
                                <th colSpan={3} className="border">Joya Medical</th>
                                <th colSpan={3} className="border">Alpha Medical</th>
                                <th colSpan={3} className="border">Med Shop</th>
                            </tr>
                            <tr>
                                <th className="border">mpn</th>
                                <th className="border">stock</th>
                                <th className="border">price</th>
                                <th className="border">mpn</th>
                                <th className="border">stock</th>
                                <th className="border">price</th>
                                <th className="border">mpn</th>
                                <th className="border">stock</th>
                                <th className="border">price</th>
                                <th className="border">mpn</th>
                                <th className="border">stock</th>
                                <th className="border">price</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <hr/>
                    <div className="mt-7 flex flex-auto flex-col items-center justify-center">
                        {
                            data.history ? "ok" : <p className="font-bold text-2xl">no history</p>
                        }
                    </div>
                </>
            }
            <button onClick={()=> competitors({...competitors, isOpen:false})} className="fixed bottom-2 rounded left-1/2 -translate-x-1/2 -translate-y-1/2 px-5 py-2 bg-amber-500 hover:bg-amber-500/70">Close</button>
        </div>
    )
}