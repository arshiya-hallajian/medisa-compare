

export const MultiSearchProduct = ({data, setData, update}) => {
    // console.log(data)

    return (
        <div
            className={`w-full md:w-11/12 h-5/6 rounded-2xl p-10 bg-gray-800 text-white fixed top-1/2 left-1/2 -translate-y-1/2 ${
                data.isOpen ? "-translate-x-1/2 block opacity-100" : "translate-x-[50rem] opacity-0"
            } flex flex-col transition duration-700`}
        >
            <div className="overflow-auto scrollbar-thin w-full">
                <table className="w-full border-separate border-spacing-y-2 text-slate-300">
                    <thead>
                    <tr>
                        <th className="border">site</th>
                        <th className="border">Name</th>
                        <th className="border">Sku & Link</th>
                        <th className="border">mpn</th>
                        <th className="border">Stock</th>
                        <th className="border">Prices</th>
                        <th className="border">update</th>
                    </tr>
                    </thead>
                    <tbody className="text-center text-xs text-white">
                    {data.data.name && (
                        <tr>
                            <td className="border">indipendence</td>
                            <td className="border break-all overflow-auto table-cell w-52 p-2 text-xs">
                                <div className="whitespace-pre-line flex justify-center items-center w-52 mx-auto">
                                    {data.data.name}
                                </div>
                            </td>
                            <td className="p-2 border whitespace-nowrap w-5">
                                <a href={data.data.link} className="text-blue-500 underline">
                                    {data.data.sku}
                                </a>
                            </td>
                            <td className="border p-2 whitespace-nowrap w-6">
                                {data.data.mpn}
                            </td>
                            <td className="border whitespace-nowrap p-2 w-52">
                                <div className="grid grid-cols-2 text-xs mx-auto w-52">
                                    {data.data.stock.map((each) => (
                                        <div
                                            key={each.name}
                                            className={`font-bold ${
                                                each.available ? "text-green-400" : "text-red-400"
                                            }`}
                                        >
                                            {each.name} : {each.quantity}
                                        </div>
                                    ))}
                                </div>
                            </td>
                            <td className="border whitespace-nowrap p-3 w-20">
                                {data.data.price.map((ePrice, i) => (
                                    <div key={i}>
                                        {ePrice.title} - {ePrice.quantity} - {ePrice.priceNumber}
                                    </div>
                                ))}
                            </td>
                            <td className="border">----</td>
                        </tr>
                    )}
                    {
                        data.data.medisa &&
                        data.data.medisa.map((eachMedisa) => {


                            return (
                                <tr key={eachMedisa.sku}>
                                    <td className="border">medisa</td>
                                    <td className="border break-all overflow-auto table-cell w-52 p-2">
                                        <div
                                            className="whitespace-pre-line flex justify-center items-center w-52 mx-auto">
                                            {eachMedisa.name}
                                        </div>
                                    </td>
                                    <td className="p-2 border whitespace-nowrap w-5">
                                        {eachMedisa.sku}
                                    </td>
                                    <td className="p-2 border whitespace-nowrap w-5">
                                        {eachMedisa.mpn ? eachMedisa.mpn : "no exist"}
                                    </td>
                                    <td className="border">----</td>
                                    {
                                        eachMedisa.type === "normal" ? (
                                                <td
                                                    className={`w-32 border ${eachMedisa.editted.color}`}
                                                >
                                                    <p>
                                                        {`${eachMedisa.name} : $${eachMedisa.editted.medisaNormalPrice}`}
                                                    </p>
                                                </td>
                                            )
                                            :
                                            eachMedisa.type === "variant" &&
                                            eachMedisa.variants.length > 0 ? (
                                                <td className="border w-32 whitespace-nowrap px-2">
                                                    {
                                                        eachMedisa.variants[0] &&
                                                        <div className={eachMedisa.variants[0].editted.color}>
                                                            {eachMedisa.variants[0].label} : ${eachMedisa.variants[0].editted.eachVariantPrice}
                                                        </div>
                                                    }

                                                    {
                                                        eachMedisa.variants[1] &&
                                                        <div className={eachMedisa.variants[1].editted.color}>
                                                            {eachMedisa.variants[1].label} : ${eachMedisa.variants[1].editted.BoxVariantPrice}
                                                        </div>
                                                    }

                                                </td>
                                            ) : (
                                                <td className="border w-32 whitespace-nowrap px-2">
                                                    <p>error</p>
                                                </td>
                                            )}
                                    <td className="border">
                                        <div className="flex flex-col gap-1 justify-center items-center w-full">
                                            <button
                                                className="bg-red-400 px-4 py-1 rounded-lg hover:bg-red-600"
                                                onClick={() => update(eachMedisa,
                                                    data.data.price,
                                                    data.data.mpn
                                                )}
                                            >
                                                update
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <button
                className="text-xl md:text-base absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-5 bg-red-400 rounded-2xl py-1 hover:bg-red-600 flex justify-center items-center"
                onClick={() => setData((prev) => ({...prev, isOpen: false}))}
            >
                close
            </button>
        </div>
    );
};

export default MultiSearchProduct;