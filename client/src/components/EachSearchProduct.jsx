import {BoxOffer, eachOffer, percent30} from "../services/calculate_offer.js";

export const EachSearchProduct = ({eachProduct, updateW, listHandler, multiP, desc}) => {

    let price_label, offer_price, offerVariantBox_price,
        offer2_price = {minPrice: null, maxPrice: null},
        offer2VariantBox_price = {minPrice: null, maxPrice: null},
        eachVariantPrice, BoxVariantPrice, medisaNormalPrice, newdesc, medisaName;



    if (eachProduct.medisa && eachProduct.medisa[0]) {
        newdesc = eachProduct.desc !== '' ? eachProduct.desc : 'No Description';
        medisaName = eachProduct.medisa[0].name.split(' ').slice(0, 3).join(' ');
        if (eachProduct.medisa[0].type === 'normal') {
            //get the price of normal product
            medisaNormalPrice = eachProduct.medisa[0].prices['calc_price']
            const name = eachProduct.medisa[0].name.toLowerCase();
            //check if is box or not and check offer price
            if (name.includes('each')) {
                price_label = 'each'
                if (eachProduct.price[0] && (eachProduct.price[0].quantity.includes('Unit') || eachProduct.price[0].quantity.includes('Units'))) {
                    const fixed_price = eachProduct.price[0].priceNumber.replace('$', '').replace(',', '')
                    offer_price = eachOffer(medisaNormalPrice, parseFloat(fixed_price))
                    offer2_price = percent30(medisaNormalPrice, parseFloat(fixed_price))
                } else {
                    offer_price = 'first no'
                }
            } else if (
                name.includes('box') ||
                name.includes('pack') ||
                name.includes('pcs') ||
                name.includes('pkt') ||
                name.includes('pkts') ||
                name.includes('carton') ||
                name.includes('jar') ||
                name.includes('jars')
            ) {
                price_label = 'Box'
                if (eachProduct.price[1]) {
                    const fixed_price = eachProduct.price[1].priceNumber.replace('$', '').replace(',', '')
                    offer_price = BoxOffer(medisaNormalPrice, parseFloat(fixed_price))
                    offer2_price = percent30(medisaNormalPrice, parseFloat(fixed_price))
                } else {
                    offer_price = 'sec no'
                }
            } else {
                price_label = 'no-label'
            }
        } else if (eachProduct.medisa && eachProduct.medisa[0].type === 'variant') {
            let fixedEach_price = null, fixedBox_price = null

            if (eachProduct.price[0] && eachProduct.price[1]) {
                fixedEach_price = parseFloat(eachProduct.price[0].priceNumber.replace('$', '').replace(',', ''))
                fixedBox_price = parseFloat(eachProduct.price[1].priceNumber.replace('$', '').replace(',', ''))
            } else if (eachProduct.price[0] && (eachProduct.price[0].quantity.includes('Unit') || eachProduct.price[0].quantity.includes('Units'))) {
                fixedEach_price = parseFloat(eachProduct.price[0].priceNumber.replace('$', '').replace(',', ''))
            } else if (eachProduct.price[0] && (!eachProduct.price[0].quantity.includes('Unit') || !eachProduct.price[0].quantity.includes('Units'))) {
                fixedBox_price = parseFloat(eachProduct.price[0].priceNumber.replace('$', '').replace(',', ''))
            }

            if (eachProduct.medisa[0].variants && eachProduct.medisa[0].variants.length > 0) {
                if (eachProduct.medisa[0].variants[0].prices['calc_price']) {
                    eachVariantPrice = eachProduct.medisa[0].variants[0].prices['calc_price'];
                    offer_price = eachOffer(eachVariantPrice, fixedEach_price)
                    offer2_price = percent30(eachVariantPrice, fixedEach_price)
                }
                // offerVariantBox_price
                if (eachProduct.medisa[0].variants.length === 2) {
                    BoxVariantPrice = eachProduct.medisa[0].variants[1].prices['calc_price'];
                    offerVariantBox_price = BoxOffer(BoxVariantPrice, fixedBox_price)
                    offer2VariantBox_price = percent30(BoxVariantPrice, fixedBox_price)
                }
            }
        } else {
            console.log('error is here')
        }

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
                eachProduct.medisa[0] ?
                    eachProduct.medisa.length === 1 ?
                        <>
                            <td className="border w-48 whitespace-nowrap">
                                {medisaName}
                            </td>
                            {
                                eachProduct.medisa[0].type === 'normal' ?
                                    <td className={`border w-32 whitespace-nowrap px-2 ${(offer2_price.maxPrice && offer2_price.minPrice) && (medisaNormalPrice > offer2_price.maxPrice || medisaNormalPrice < offer2_price.minPrice ? 'bg-red-600' : medisaNormalPrice <= offer_price ? 'bg-green-600' : 'bg-orange-600')} `}>
                                        <p>
                                            {
                                                `${price_label} : $${medisaNormalPrice}`
                                            }
                                        </p>
                                    </td>
                                    :
                                    eachProduct.medisa[0].type === 'variant' && eachProduct.medisa[0].variants.length > 0 ?
                                        <td className={`border w-32 whitespace-nowrap px-2 `}>
                                            {
                                                eachProduct.medisa[0].variants[0] &&
                                                <div
                                                    className={`${(offer2_price.maxPrice && offer2_price.minPrice) && (eachVariantPrice > offer2_price.maxPrice || eachVariantPrice < offer2_price.minPrice ? 'text-red-600' : eachVariantPrice <= offer_price ? 'text-green-600' : 'text-orange-600')}`}>
                                                    {
                                                        `${eachProduct.medisa[0].variants[0].label} : $${eachVariantPrice}`
                                                    }
                                                </div>
                                            }
                                            {
                                                eachProduct.medisa[0].variants[1] &&
                                                <div
                                                    //
                                                    className={`${(offer2VariantBox_price.maxPrice && offer2VariantBox_price.minPrice) && (BoxVariantPrice > offer2VariantBox_price.maxPrice || BoxVariantPrice < offer2VariantBox_price.minPrice ? 'text-red-600' : BoxVariantPrice <= offerVariantBox_price ? 'text-green-600' : 'text-orange-600')}`}>
                                                    {`${eachProduct.medisa[0].variants[1].label} : $${BoxVariantPrice}`}
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
                                            {
                                                Neach: offer_price,
                                                Vbox: offerVariantBox_price
                                            },
                                            eachProduct.price,
                                            eachVariantPrice,
                                            BoxVariantPrice,
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
                            onClick={() => listHandler(eachProduct, offer_price)}
                            className="px-4 py-1 bg-red-400 rounded-lg hover:bg-red-600">
                            add to list
                        </button>
                    </td>
            }

        </tr>
    )
}