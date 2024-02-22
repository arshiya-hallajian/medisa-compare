export const EachSearchProduct = ({eachProduct, updateW, listHandler, multiP, desc}) => {

    let newdesc, medisaName;

    if (eachProduct.medisa) {
        newdesc = eachProduct.desc !== '' ? eachProduct.desc : 'No Description';
        medisaName = eachProduct.medisa[0].name.split(' ').slice(0, 3).join(' ');

    }


    return (
        <tr
            className={` text-slate-100`}>
            <td className="border break-all overflow-auto table-cell w-52 p-2 ">
                <div
                    className="whitespace-pre-line flex justify-center items-center w-52 mx-auto px-3">
                    {eachProduct.name}
                </div>
            </td>
            <td className="p-2 border whitespace-nowrap w-5">
                <a href={eachProduct.link} className="text-blue-500 underline">
                    {eachProduct.sku}
                </a>
            </td>
            <td className="border p-2 whitespace-nowrap w-6"
                onClick={() => desc(newdesc, eachProduct.specs)}>
                {eachProduct.mpn}
            </td>
            <td className="border whitespace-nowrap p-2 w-52">
                <div className="grid grid-cols-2 text-xs mx-auto w-52">
                    {
                        eachProduct.stock.map((each) => (
                            <div key={each.name}
                                 className={`font-bold ${each.quantity > 5 ? "text-green-400" : (each.quantity > 0 && each.quantity <= 5) ? 'text-orange-400' : "text-red-400"}`}>
                                {each.name} : {each.quantity}
                            </div>
                        ))
                    }

                </div>
            </td>
            <td className="border whitespace-nowrap p-3 w-20 text-sm">
                {eachProduct.price.map((ePrice, i) => {
                    return (
                        <div key={i}>
                            {ePrice.title} - {ePrice.quantity} - {ePrice.priceNumber}
                        </div>
                    )
                })}
            </td>
            {
                eachProduct.medisa ?
                    eachProduct.medisa.length === 1 ?
                        <>
                            <td className="border w-48 whitespace-nowrap">
                                {medisaName}
                            </td>
                            {
                                eachProduct.medisa[0].type === 'normal' ?
                                    <td className={`${eachProduct.medisa[0].editted.color}`}>
                                        <p>
                                            {
                                                `${eachProduct.medisa[0].editted.price_label} : $${eachProduct.medisa[0].editted.medisaNormalPrice}`
                                            }
                                        </p>
                                    </td>
                                    :
                                    eachProduct.medisa[0].type === 'variant' && eachProduct.medisa[0].variants.length > 0 ?
                                        <td className={`border w-32 whitespace-nowrap px-2 `}>
                                            {
                                                eachProduct.medisa[0].variants[0] &&
                                                <div
                                                    className={`${eachProduct.medisa[0].variants[0].editted.color}`}>
                                                    {
                                                        `${eachProduct.medisa[0].variants[0].label} : $${eachProduct.medisa[0].variants[0].editted.eachVariantPrice}`
                                                    }
                                                </div>
                                            }
                                            {
                                                eachProduct.medisa[0].variants[1] &&
                                                <div className={`${eachProduct.medisa[0].variants[1].editted.color}`}>
                                                    {`${eachProduct.medisa[0].variants[1].label} : $${eachProduct.medisa[0].variants[1].editted.BoxVariantPrice}`}
                                                </div>
                                            }
                                        </td> :
                                        <td className={`border w-32 whitespace-nowrap px-2 `}>
                                            <p>error</p>
                                        </td>
                            }
                            <td className="border w-36 whitespace-nowrap px-2">{eachProduct.medisa[0].sku}</td>
                            <td className="border whitespace-nowrap">
                                <div
                                    className="flex flex-col gap-1 justify-center items-center w-full px-2">

                                    <button
                                        className="bg-red-400 px-4 py-1 rounded-lg hover:bg-red-600"
                                        onClick={() => updateW(
                                            eachProduct.medisa[0],
                                            eachProduct.price,
                                            eachProduct.mpn
                                        )}>
                                        update
                                    </button>
                                </div>
                            </td>
                        </>
                        :
                        <td className="border cursor-pointer w-full hover:bg-slate-600"
                            colSpan={4} onClick={() => multiP(eachProduct)}>
                            two product found
                        </td>
                    :
                    <td className="border" colSpan={5}>
                        <button disabled={true}
                            // onClick={() => listHandler(eachProduct, offer_price)}
                                onClick={() => console.log("add clicked")}
                                className="px-4 py-1 bg-red-400 rounded-lg hover:bg-red-600">
                            add to list
                        </button>
                    </td>
            }

        </tr>
    )
}