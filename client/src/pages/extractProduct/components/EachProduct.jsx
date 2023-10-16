import {BoxOffer, eachOffer, percent30} from "../../../services/calculate_offer.js";

export const EachProduct = ({row, updateW,listHandler,multiP,desc}) => {

    const newdesc = row.desc !== '' ? row.desc : 'No Description';
    const medisaName = row.medisa && row.medisa[0].name.split(' ').slice(0, 3).join(' ');


    let show_Price, price_label, offer_price, offerVariantBox_price,
        offer2_price={minPrice:null,maxPrice:null},
        offer2VariantBox_price={minPrice:null,maxPrice:null},
        eachVariantPrice, BoxVariantPrice
    if (row.medisa && row.medisa[0].type === 'normal') {
        //get the price of normal product
        if (row.medisa[0].prices[3] && row.medisa[0].prices[3].price !== 0) {
            show_Price = row.medisa[0].prices[3].price;
        } else if (row.medisa[0].prices[2] && row.medisa[0].prices[2].price !== 0) {
            show_Price = row.medisa[0].prices[2].price;
        } else {
            show_Price = row.medisa[0].prices[0].price;
        }

        const name = row.medisa[0].name.toLowerCase();
        //check if is box or not and check offer price
        if (name.includes('each')) {
            price_label = 'each'
            if (row.price[0] && (row.price[0].quantity.includes('Unit') || row.price[0].quantity.includes('Units'))) {
                const fixed_price = row.price[0].priceNumber.replace('$', '').replace(',', '')
                offer_price = eachOffer(show_Price, parseFloat(fixed_price))
                offer2_price = percent30(show_Price, parseFloat(fixed_price))
            } else {
                offer_price = 'first no'
            }
        } else if (name.includes('box') || name.includes('pack') || name.includes('pcs') || name.includes('pkt') || name.includes('pkts') || name.includes('carton') || name.includes('jar') || name.includes('jars')) {
            price_label = 'Box'
            if (row.price[1]) {
                const fixed_price = row.price[1].priceNumber.replace('$', '').replace(',', '')
                offer_price = BoxOffer(show_Price, parseFloat(fixed_price))
                offer2_price = percent30(show_Price, parseFloat(fixed_price))
            } else {
                offer_price = 'sec no'
            }
        } else {
            price_label = 'no-label'
        }
    } else if (row.medisa && row.medisa[0].type === 'variant') {
        let fixedEach_price = null, fixedBox_price = null

        if (row.price[0] && row.price[1]) {
            fixedEach_price = parseFloat(row.price[0].priceNumber.replace('$', '').replace(',', ''))
            fixedBox_price = parseFloat(row.price[1].priceNumber.replace('$', '').replace(',', ''))
        } else if (row.price[0] && (row.price[0].quantity.includes('Unit') || row.price[0].quantity.includes('Units'))) {
            fixedEach_price = parseFloat(row.price[0].priceNumber.replace('$', '').replace(',', ''))
        } else if (row.price[0] && (!row.price[0].quantity.includes('Unit') || !row.price[0].quantity.includes('Units'))) {
            fixedBox_price = parseFloat(row.price[0].priceNumber.replace('$', '').replace(',', ''))
        }

        if (row.medisa[0].price && row.medisa[0].price.length > 0) {
            if (row.medisa[0].price[0].price[3] && row.medisa[0].price[0].price[3].price !== 0) {
                offer_price = eachOffer(row.medisa[0].price[0].price[3].price, fixedEach_price)
                offer2_price = percent30(row.medisa[0].price[0].price[3].price, fixedEach_price)

                if ((typeof(row.medisa[0].price[0].label[0]) === 'string') && row.medisa[0].price[0].label.length > 1) {
                    eachVariantPrice = [`${row.medisa[0].price[0].label[0]} - ${row.medisa[0].price[0].label[1]}`, row.medisa[0].price[0].price[3].price];
                } else if ((typeof(row.medisa[0].price[0].label[0]) === 'string') && row.medisa[0].price[0].label.length > 0 ) {
                    eachVariantPrice = [`${row.medisa[0].price[0].label[0]}`, row.medisa[0].price[0].price[3].price];
                } else if(row.medisa[0].price[0].label.length > 1){
                    eachVariantPrice = [`${row.medisa[0].price[0].label[0].label} - ${row.medisa[0].price[0].label[1].label}`, row.medisa[0].price[0].price[3].price];
                } else{
                    eachVariantPrice = [row.medisa[0].price[0].label[0].label, row.medisa[0].price[0].price[3].price];
                }
            } else if (row.medisa[0].price[0].price[2] && row.medisa[0].price[0].price[2].price !== 0) {
                offer_price = eachOffer(row.medisa[0].price[0].price[2].price, fixedEach_price)
                offer2_price = percent30(row.medisa[0].price[0].price[2].price, fixedEach_price)
                if ((typeof(row.medisa[0].price[0].label[0]) === 'string') && row.medisa[0].price[0].label.length > 1) {
                    eachVariantPrice = [`${row.medisa[0].price[0].label[0]} - ${row.medisa[0].price[0].label[1]}`, row.medisa[0].price[0].price[2].price];
                } else if ((typeof(row.medisa[0].price[0].label[0]) === 'string') && row.medisa[0].price[0].label.length > 0 ) {
                    eachVariantPrice = [`${row.medisa[0].price[0].label[0]}`, row.medisa[0].price[0].price[2].price];
                } else if(row.medisa[0].price[0].label.length > 1){
                    eachVariantPrice = [`${row.medisa[0].price[0].label[0].label} - ${row.medisa[0].price[0].label[1].label}`, row.medisa[0].price[0].price[2].price];
                } else{
                    eachVariantPrice = [row.medisa[0].price[0].label[0].label, row.medisa[0].price[0].price[2].price];
                }
            } else {
                offer_price = eachOffer(row.medisa[0].price[0].price[0].price, fixedEach_price)
                offer2_price = percent30(row.medisa[0].price[0].price[0].price, fixedEach_price)
                // console.log(typeof (row.medisa[0].price[0].label[0]))
                if ((typeof(row.medisa[0].price[0].label[0]) === 'string') && row.medisa[0].price[0].label.length > 1) {
                    eachVariantPrice = [`${row.medisa[0].price[0].label[0]} - ${row.medisa[0].price[0].label[1]}`, row.medisa[0].price[0].price[0].price];
                } else if ((typeof(row.medisa[0].price[0].label[0]) === 'string') && row.medisa[0].price[0].label.length > 0 ) {
                    eachVariantPrice = [`${row.medisa[0].price[0].label[0]}`, row.medisa[0].price[0].price[0].price];
                } else if(row.medisa[0].price[0].label.length > 1){
                    eachVariantPrice = [`${row.medisa[0].price[0].label[0].label} - ${row.medisa[0].price[0].label[1].label}`, row.medisa[0].price[0].price[0].price];
                } else{
                    eachVariantPrice = [row.medisa[0].price[0].label[0].label, row.medisa[0].price[0].price[0].price];
                }
            }
            // offerVariantBox_price
            if (row.medisa[0].price.length === 2) {
                offerVariantBox_price = BoxOffer(row.medisa[0].price[1].price[3].price, fixedBox_price)
                offer2VariantBox_price = percent30(row.medisa[0].price[1].price[3].price, fixedBox_price)
                if (row.medisa[0].price[1].price[3] && row.medisa[0].price[1].price[3].price !== 0) {
                    if ((typeof (row.medisa[0].price[0].label[0]) === 'string') && row.medisa[0].price[1].label.length > 1) {
                        BoxVariantPrice = [`${row.medisa[0].price[1].label[0]} - ${row.medisa[0].price[1].label[1]}`, row.medisa[0].price[1].price[3].price];
                    } else if((typeof (row.medisa[0].price[0].label[0]) === 'string') && row.medisa[0].price[1].label.length > 0) {
                        BoxVariantPrice = [`${row.medisa[0].price[1].label[0]}`, row.medisa[0].price[1].price[3].price];
                    } else if(row.medisa[0].price[1].label.length > 1){
                        BoxVariantPrice = [`${row.medisa[0].price[1].label[0].label} - ${row.medisa[0].price[1].label[1].label}`, row.medisa[0].price[1].price[3].price];
                    }else{
                        BoxVariantPrice = [row.medisa[0].price[1].label[0].label, row.medisa[0].price[1].price[3].price];
                    }
                } else if (row.medisa[0].price[0].price[2] && row.medisa[0].price[1].price[2].price !== 0) {
                    offerVariantBox_price = BoxOffer(row.medisa[0].price[1].price[2].price, fixedBox_price)
                    offer2VariantBox_price = percent30(row.medisa[0].price[1].price[2].price, fixedBox_price)

                    if ((typeof (row.medisa[0].price[0].label[0]) === 'string') && row.medisa[0].price[1].label.length > 1) {
                        BoxVariantPrice = [`${row.medisa[0].price[1].label[0]} - ${row.medisa[0].price[1].label[1]}`, row.medisa[0].price[1].price[2].price];
                    } else if((typeof (row.medisa[0].price[0].label[0]) === 'string') && row.medisa[0].price[1].label.length > 0) {
                        BoxVariantPrice = [`${row.medisa[0].price[1].label[0]}`, row.medisa[0].price[1].price[2].price];
                    } else if(row.medisa[0].price[1].label.length > 1){
                        BoxVariantPrice = [`${row.medisa[0].price[1].label[0].label} - ${row.medisa[0].price[1].label[1].label}`, row.medisa[0].price[1].price[2].price];
                    }else{
                        BoxVariantPrice = [row.medisa[0].price[1].label[0].label, row.medisa[0].price[1].price[2].price];
                    }
                } else {
                    offerVariantBox_price = BoxOffer(row.medisa[0].price[1].price[0].price, fixedBox_price)
                    offer2VariantBox_price = percent30(row.medisa[0].price[1].price[0].price, fixedBox_price)

                    if ((typeof (row.medisa[0].price[0].label[0]) === 'string') && row.medisa[0].price[1].label.length > 1) {
                        BoxVariantPrice = [`${row.medisa[0].price[1].label[0]} - ${row.medisa[0].price[1].label[1]}`, row.medisa[0].price[1].price[0].price];
                    } else if((typeof (row.medisa[0].price[0].label[0]) === 'string') && row.medisa[0].price[1].label.length > 0) {
                        BoxVariantPrice = [`${row.medisa[0].price[1].label[0]}`, row.medisa[0].price[1].price[0].price];
                    } else if(row.medisa[0].price[1].label.length > 1){
                        BoxVariantPrice = [`${row.medisa[0].price[1].label[0].label} - ${row.medisa[0].price[1].label[1].label}`, row.medisa[0].price[1].price[0].price];
                    }else{
                        BoxVariantPrice = [row.medisa[0].price[1].label[0].label, row.medisa[0].price[1].price[0].price];
                    }
                }
            }
        }
    }

    return (
        <tr
            className={` text-slate-100`}>
            <td className="border break-all overflow-auto table-cell w-52 p-2 ">
                <div
                    className="whitespace-pre-line flex justify-center items-center w-52 mx-auto px-3">
                    {row.name}
                </div>
            </td>
            <td className="p-2 border whitespace-nowrap w-5">
                <a href={row.link} className="text-blue-500 underline">
                    {row.sku}
                </a>
            </td>
            <td className="border p-2 whitespace-nowrap w-6"
                onClick={() => desc(newdesc, row.specs)}>
                {row.mpn}
            </td>
            <td className="border whitespace-nowrap p-2 w-52">
                <div className="grid grid-cols-2 text-xs mx-auto w-52">
                    {
                        row.stock.map((each) => (
                            <div key={each.name}
                                 className={`font-bold ${each.quantity > 5 ? "text-green-400" : (each.quantity > 0 && each.quantity <= 5) ? 'text-orange-400' : "text-red-400"}`}>
                                {each.name} : {each.quantity}
                            </div>
                        ))
                    }

                </div>
            </td>
            <td className="border whitespace-nowrap p-3 w-20 text-sm">
                {row.price.map((ePrice, i) => {
                    return (
                        <div key={i}>
                            {ePrice.title} - {ePrice.quantity} - {ePrice.priceNumber}
                        </div>
                    )
                })}
            </td>
            {
                row.medisa ?
                    row.medisa.length === 1 ? <>
                            <td className="border w-48 whitespace-nowrap">
                                {medisaName}
                            </td>

                            {
                                row.medisa[0].type === 'normal' ?
                                    <td className={`border w-32 whitespace-nowrap px-2 ${ (offer2_price.maxPrice && offer2_price.minPrice) && (show_Price > offer2_price.maxPrice || show_Price < offer2_price.minPrice ? 'bg-red-600' : show_Price <= offer_price ? 'bg-green-600' : 'bg-orange-600')} `}>
                                        <p>
                                            {
                                                `${price_label} : $${show_Price}`
                                            }
                                        </p>
                                    </td>
                                    : row.medisa[0].type === 'variant' && row.medisa[0].price.length > 0 ?
                                        <td className={`border w-32 whitespace-nowrap px-2 `}>
                                            {
                                                eachVariantPrice &&
                                                <div
                                                    className={`${ (offer2_price.maxPrice && offer2_price.minPrice) && (eachVariantPrice[1] > offer2_price.maxPrice || eachVariantPrice[1] < offer2_price.minPrice ? 'text-red-600' : eachVariantPrice[1] <= offer_price ? 'text-green-600' : 'text-orange-600')}`}>
                                                    {
                                                        `${eachVariantPrice[0]} : $${eachVariantPrice[1]}`
                                                    }
                                                </div>
                                            }
                                            {BoxVariantPrice &&
                                                <div
                                                    //
                                                    className={`${(offer2VariantBox_price.maxPrice && offer2VariantBox_price.minPrice) && (BoxVariantPrice[1] > offer2VariantBox_price.maxPrice || BoxVariantPrice[1] < offer2VariantBox_price.minPrice ? 'text-red-600' : BoxVariantPrice[1] <= offerVariantBox_price ? 'text-green-600' : 'text-orange-600') }`}>
                                                    {/*{`${BoxVariantPrice[0]} : $${BoxVariantPrice[1]}-> ${offerVariantBox_price} -> M${offer2VariantBox_price.maxPrice} -> m${offer2VariantBox_price.minPrice} B`}*/}
                                                    {`${BoxVariantPrice[0]} : $${BoxVariantPrice[1]}`}
                                                </div>
                                            }
                                        </td> :
                                        <td className={`border w-32 whitespace-nowrap px-2 `}>
                                            <p>error</p>
                                        </td>
                            }
                            <td className="border w-36 whitespace-nowrap px-2">{row.medisa[0].sku}</td>
                            <td className="border whitespace-nowrap">
                                <div
                                    className="flex flex-col gap-1 justify-center items-center w-full px-2">

                                    <button
                                        className="bg-red-400 px-4 py-1 rounded-lg hover:bg-red-600"
                                        onClick={() => updateW(row.medisa[0],
                                            {
                                                Neach: offer_price,
                                                Vbox: offerVariantBox_price
                                            },
                                            row.price,
                                            eachVariantPrice,
                                            BoxVariantPrice)}>update
                                    </button>
                                </div>
                            </td>
                        </>
                        :
                        <td className="border cursor-pointer w-full hover:bg-slate-600"
                            colSpan={4} onClick={() => multiP(row)}>
                            two product found
                        </td>
                    :
                    <td className="border" colSpan={5}>
                        <button
                            onClick={() => listHandler(row, offer_price)}
                            className="px-4 py-1 bg-red-400 rounded-lg hover:bg-red-600">
                            add to list
                        </button>
                    </td>
            }

        </tr>
    )
}