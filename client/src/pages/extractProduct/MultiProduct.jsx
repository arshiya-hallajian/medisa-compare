
import {BoxOffer, eachOffer, percent30} from "../../services/calculate_offer.js";

export const MultiProduct = ({data, setData, update}) => {
    // console.log(data)
    const calculateOfferPrice = (showPrice, fixedPrice) => {
        if (showPrice > fixedPrice) {
            return "bg-red-600";
        } else if (showPrice <= fixedPrice) {
            return "bg-green-600";
        } else {
            return "bg-orange-600";
        }
    };

    const calculateVariantPrice = (variantPrice, offerPrice, offer2Price) => {
        const [label, price] = variantPrice;
        // = calculateOfferPrice(price, offerPrice)
        let className ;

        if (offer2Price.minPrice && offer2Price.maxPrice) {
            if (price > offer2Price.maxPrice || price < offer2Price.minPrice) {
                className = "text-red-600";
            } else if (price <= offerPrice) {
                className = "text-green-600";
            } else {
                className = "text-orange-600";
            }
        }else{
            className= ""
        }

        return (
            <div className={className}>
                {label} : ${price}
            </div>
        );
    };

    return (
        <div
            className={`w-full md:w-11/12 h-5/6 rounded-2xl p-10 bg-gray-800 text-white fixed top-1/2 left-1/2 -translate-y-1/2 ${
                data.isOpen ? "-translate-x-1/2 block opacity-100" : "translate-x-[50rem] opacity-0"
            } flex flex-col transition duration-700`}
        >
            <div className="overflow-auto scrollbar scrollbar-thin w-full">
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
                    {data.data.medisa &&
                        data.data.medisa.map((eachMedisa) => {
                            let show_Price,
                                price_label,
                                offer_price,
                                offerVariantBox_price,
                                offer2_price = {minPrice: null, maxPrice: null},
                                offer2VariantBox_price = {minPrice: null, maxPrice: null},
                                eachVariantPrice = null,
                                BoxVariantPrice = null;

                            if (data.data.medisa && eachMedisa.type === "normal") {
                                if (eachMedisa.prices[3] && eachMedisa.prices[3].price !== 0) {
                                    show_Price = eachMedisa.prices[3].price;
                                } else if (
                                    eachMedisa.prices[2] &&
                                    eachMedisa.prices[2].price !== 0
                                ) {
                                    show_Price = eachMedisa.prices[2].price;
                                } else {
                                    show_Price = eachMedisa.prices[0].price;
                                }

                                const name = eachMedisa.name.toLowerCase();
                                if (name.includes("each")) {
                                    price_label = "each";
                                    if (
                                        data.data.price[0] &&
                                        (data.data.price[0].quantity.includes("Unit") ||
                                            data.data.price[0].quantity.includes("Units"))
                                    ) {
                                        const fixed_price = data.data.price[0].priceNumber
                                            .replace("$", "")
                                            .replace(",", "");
                                        offer_price = eachOffer(show_Price, parseFloat(fixed_price));
                                        offer2_price = percent30(show_Price, parseFloat(fixed_price));
                                    } else {
                                        offer_price = "first no";
                                    }
                                } else if (
                                    name.includes("box") ||
                                    name.includes("pack") ||
                                    name.includes("pcs") ||
                                    name.includes("pkt") ||
                                    name.includes("pkts") ||
                                    name.includes("carton") ||
                                    name.includes("jar") ||
                                    name.includes("jars")
                                ) {
                                    price_label = "Box";
                                    if (data.data.price[1]) {
                                        const fixed_price = data.data.price[1].priceNumber
                                            .replace("$", "")
                                            .replace(",", "");
                                        offer_price = BoxOffer(show_Price, parseFloat(fixed_price));
                                        offer2_price = percent30(show_Price, parseFloat(fixed_price));
                                    } else {
                                        const fixed_price = data.data.price[0].priceNumber
                                            .replace("$", "")
                                            .replace(",", "");
                                        offer_price = BoxOffer(show_Price, parseFloat(fixed_price));
                                        offer2_price = percent30(show_Price, parseFloat(fixed_price));
                                    }
                                } else {
                                    price_label = "no-label";
                                }
                            } else if (data.data.medisa && eachMedisa.type === "variant") {
                                let fixedEach_price = null,
                                    fixedBox_price = null;

                                if (data.data.price[0] && data.data.price[1]) {
                                    fixedEach_price = parseFloat(
                                        data.data.price[0].priceNumber.replace("$", "").replace(",", "")
                                    );
                                    fixedBox_price = parseFloat(
                                        data.data.price[1].priceNumber.replace("$", "").replace(",", "")
                                    );
                                } else if (
                                    data.data.price[0] &&
                                    (data.data.price[0].quantity.includes("Unit") ||
                                        data.data.price[0].quantity.includes("Units"))
                                ) {
                                    fixedEach_price = parseFloat(
                                        data.data.price[0].priceNumber.replace("$", "").replace(",", "")
                                    );
                                } else if (
                                    data.data.price[0] &&
                                    (!data.data.price[0].quantity.includes("Unit") ||
                                        !data.data.price[0].quantity.includes("Units"))
                                ) {
                                    fixedBox_price = parseFloat(
                                        data.data.price[0].priceNumber.replace("$", "").replace(",", "")
                                    );
                                }

                                if (eachMedisa.price && eachMedisa.price.length > 0) {
                                    if (eachMedisa.price[0].price[3] && eachMedisa.price[0].price[3].price !== 0) {
                                        offer_price = eachOffer(eachMedisa.price[0].price[3].price, fixedEach_price);
                                        offer2_price = percent30(eachMedisa.price[0].price[3].price, fixedEach_price);

                                        if (typeof eachMedisa.price[0].label[0] === "string" && eachMedisa.price[0].label.length > 1) {
                                            eachVariantPrice = [`${eachMedisa.price[0].label[0]} - ${eachMedisa.price[0].label[1]}`, eachMedisa.price[0].price[3].price,];
                                        } else if (typeof eachMedisa.price[0].label[0] === "string" && eachMedisa.price[0].label.length > 0) {
                                            eachVariantPrice = [`${eachMedisa.price[0].label[0]}`, eachMedisa.price[0].price[3].price,];
                                        } else if (eachMedisa.price[0].label.length > 1) {
                                            eachVariantPrice = [`${eachMedisa.price[0].label[0].label} - ${eachMedisa.price[0].label[1].label}`, eachMedisa.price[0].price[3].price,];
                                        } else {
                                            eachVariantPrice = [eachMedisa.price[0].label[0].label, eachMedisa.price[0].price[3].price,];
                                        }
                                    } else if (eachMedisa.price[0].price[2] && eachMedisa.price[0].price[2].price !== 0) {
                                        offer_price = eachOffer(eachMedisa.price[0].price[2].price, fixedEach_price);
                                        offer2_price = percent30(eachMedisa.price[0].price[2].price, fixedEach_price);

                                        if (typeof eachMedisa.price[0].label[0] === "string" && eachMedisa.price[0].label.length > 1) {
                                            eachVariantPrice = [`${eachMedisa.price[0].label[0]} - ${eachMedisa.price[0].label[1]}`, eachMedisa.price[0].price[2].price,];
                                        } else if (typeof eachMedisa.price[0].label[0] === "string" && eachMedisa.price[0].label.length > 0) {
                                            eachVariantPrice = [`${eachMedisa.price[0].label[0]}`, eachMedisa.price[0].price[2].price];
                                        } else if (eachMedisa.price[0].label.length > 1) {
                                            eachVariantPrice = [`${eachMedisa.price[0].label[0].label} - ${eachMedisa.price[0].label[1].label}`, eachMedisa.price[0].price[2].price,];
                                        } else {
                                            eachVariantPrice = [eachMedisa.price[0].label[0].label, eachMedisa.price[0].price[2].price];
                                        }
                                    } else {
                                        offer_price = eachOffer(eachMedisa.price[0].price[0].price, fixedEach_price);
                                        offer2_price = percent30(eachMedisa.price[0].price[0].price, fixedEach_price);

                                        if (typeof eachMedisa.price[0].label[0] === "string" && eachMedisa.price[0].label.length > 1) {
                                            eachVariantPrice = [`${eachMedisa.price[0].label[0]} - ${eachMedisa.price[0].label[1]}`, eachMedisa.price[0].price[0].price,];
                                        } else if (typeof eachMedisa.price[0].label[0] === "string" && eachMedisa.price[0].label.length > 0) {
                                            eachVariantPrice = [`${eachMedisa.price[0].label[0]}`, eachMedisa.price[0].price[0].price];
                                        } else if (eachMedisa.price[0].label.length > 1) {
                                            eachVariantPrice = [`${eachMedisa.price[0].label[0].label} - ${eachMedisa.price[0].label[1].label}`, eachMedisa.price[0].price[0].price,];
                                        } else {
                                            eachVariantPrice = [eachMedisa.price[0].label[0].label, eachMedisa.price[0].price[0].price];
                                        }
                                    }

                                    if (eachMedisa.price.length === 2) {
                                        offerVariantBox_price = BoxOffer(eachMedisa.price[1].price[3].price, fixedBox_price);
                                        offer2VariantBox_price = percent30(eachMedisa.price[1].price[3].price, fixedBox_price);

                                        if (eachMedisa.price[1].price[3] && eachMedisa.price[1].price[3].price !== 0) {
                                            if (typeof eachMedisa.price[0].label[0] === "string" && eachMedisa.price[1].label.length > 1) {
                                                BoxVariantPrice = [`${eachMedisa.price[1].label[0]} - ${eachMedisa.price[1].label[1]}`, eachMedisa.price[1].price[3].price];
                                            } else if (typeof eachMedisa.price[0].label[0] === "string" && eachMedisa.price[1].label.length > 0) {
                                                BoxVariantPrice = [`${eachMedisa.price[1].label[0]}`, eachMedisa.price[1].price[3].price];
                                            } else if (eachMedisa.price[1].label.length > 1) {
                                                BoxVariantPrice = [`${eachMedisa.price[1].label[0].label} - ${eachMedisa.price[1].label[1].label}`, eachMedisa.price[1].price[3].price];
                                            } else {
                                                BoxVariantPrice = [eachMedisa.price[1].label[0].label, eachMedisa.price[1].price[3].price];
                                            }
                                        } else if (eachMedisa.price[0].price[2] && eachMedisa.price[1].price[2].price !== 0) {
                                            offerVariantBox_price = BoxOffer(eachMedisa.price[1].price[2].price, fixedBox_price);
                                            offer2VariantBox_price = percent30(eachMedisa.price[1].price[2].price, fixedBox_price);

                                            if (typeof eachMedisa.price[0].label[0] === "string" && eachMedisa.price[1].label.length > 1) {
                                                BoxVariantPrice = [`${eachMedisa.price[1].label[0]} - ${eachMedisa.price[1].label[1]}`, eachMedisa.price[1].price[2].price];
                                            } else if (typeof eachMedisa.price[0].label[0] === "string" && eachMedisa.price[1].label.length > 0
                                            ) {
                                                BoxVariantPrice = [`${eachMedisa.price[1].label[0]}`, eachMedisa.price[1].price[2].price];
                                            } else if (eachMedisa.price[1].label.length > 1) {
                                                BoxVariantPrice = [`${eachMedisa.price[1].label[0].label} - ${eachMedisa.price[1].label[1].label}`, eachMedisa.price[1].price[2].price];
                                            } else {
                                                BoxVariantPrice = [eachMedisa.price[1].label[0].label, eachMedisa.price[1].price[2].price];
                                            }
                                        } else {
                                            offerVariantBox_price = BoxOffer(eachMedisa.price[1].price[0].price, fixedBox_price);
                                            offer2VariantBox_price = percent30(eachMedisa.price[1].price[0].price, fixedBox_price);

                                            if (typeof eachMedisa.price[0].label[0] === "string" && eachMedisa.price[1].label.length > 1) {
                                                BoxVariantPrice = [`${eachMedisa.price[1].label[0]} - ${eachMedisa.price[1].label[1]}`, eachMedisa.price[1].price[0].price,];
                                            } else if (typeof eachMedisa.price[0].label[0] === "string" && eachMedisa.price[1].label.length > 0) {
                                                BoxVariantPrice = [`${eachMedisa.price[1].label[0]}`, eachMedisa.price[1].price[0].price];
                                            } else if (eachMedisa.price[1].label.length > 1) {
                                                BoxVariantPrice = [`${eachMedisa.price[1].label[0].label} - ${eachMedisa.price[1].label[1].label}`, eachMedisa.price[1].price[0].price];
                                            } else {
                                                BoxVariantPrice = [eachMedisa.price[1].label[0].label, eachMedisa.price[1].price[0].price];
                                            }
                                        }
                                    }
                                }
                            }

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
                                    {eachMedisa.type === "normal" ? (
                                        <td
                                            className={`w-32 border ${calculateOfferPrice(
                                                show_Price,
                                                offer2_price.maxPrice,
                                                offer2_price.minPrice
                                            )}`}
                                        >
                                            <p>
                                                {`${price_label} : $${show_Price}`}
                                            </p>
                                        </td>
                                    ) : eachMedisa.type === "variant" &&
                                    eachMedisa.price.length > 0 ? (
                                        <td className="border w-32 whitespace-nowrap px-2">
                                            {eachVariantPrice &&
                                                calculateVariantPrice(
                                                    eachVariantPrice,
                                                    offer_price,
                                                    offer2_price
                                                )}
                                            {BoxVariantPrice &&
                                                calculateVariantPrice(
                                                    BoxVariantPrice,
                                                    offerVariantBox_price,
                                                    offer2VariantBox_price
                                                )}
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
                                                    {
                                                        Neach: offer_price,
                                                        Vbox: offerVariantBox_price
                                                    },
                                                    data.data.price,
                                                    eachVariantPrice,
                                                    BoxVariantPrice,
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

export default MultiProduct;