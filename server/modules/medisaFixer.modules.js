const medisaEditor = (medisaData, PriceDifferenceCounter, StockCounter) => {
    return new Promise((resolve) => {
        for (let eachMedisa of medisaData.medisa) {
            let eachColor, price_label, offer_price, offerVariantBox_price,
                offer2_price = {minPrice: null, maxPrice: null},
                offer2VariantBox_price = {minPrice: null, maxPrice: null},
                eachVariantPrice, BoxVariantPrice, medisaNormalPrice;

            if (medisaData.stock[1].quantity === 0 && !eachMedisa.inventory) {
                StockCounter.push(medisaData.mpn)
            }

            if (medisaData.medisa && eachMedisa.type === "normal") {

                medisaNormalPrice = eachMedisa.prices['calc_price']
                // medisaName = eachMedisa.name.split(' ').slice(0, 3).join(' ');

                const name = eachMedisa.name.toLowerCase();
                if (name.includes("each")) {
                    price_label = "each";
                    if (
                        medisaData.price[0] &&
                        (medisaData.price[0].quantity.includes("Unit") || medisaData.price[0].quantity.includes("Units"))
                    ) {
                        const fixed_price = medisaData.price[0].priceNumber.replace("$", "").replace(",", "");
                        // offer_price = eachOffer(medisaNormalPrice, parseFloat(fixed_price));
                        eachColor = calculate_priceColor(medisaNormalPrice, parseFloat(fixed_price), false)
                        // offer2_price = percent30(medisaNormalPrice, parseFloat(fixed_price));
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
                    price_label = eachMedisa.name;
                    if (medisaData.price[1]) {
                        const fixed_price = medisaData.price[1].priceNumber.replace("$", "").replace(",", "");
                        eachColor = calculate_priceColor(medisaNormalPrice, parseFloat(fixed_price), false)
                        // offer_price = BoxOffer(medisaNormalPrice, parseFloat(fixed_price));
                        // offer2_price = percent30(medisaNormalPrice, parseFloat(fixed_price));
                    } else {
                        const fixed_price = medisaData.price[0].priceNumber.replace("$", "").replace(",", "");
                        eachColor = calculate_priceColor(medisaNormalPrice, parseFloat(fixed_price), false)
                        // offer_price = BoxOffer(medisaNormalPrice, parseFloat(fixed_price));
                        // offer2_price = percent30(medisaNormalPrice, parseFloat(fixed_price));
                    }
                } else {
                    price_label = "no-label";
                }
                // let color = calculateOfferPrice(medisaNormalPrice, offer_price, offer2_price, false)
                // let color = calculate_priceColor(medisaNormalPrice, o)
                if (eachColor.color === "text-red-600" || eachColor.color === "bg-red-600") {
                    PriceDifferenceCounter.push(medisaData.mpn)
                }
                eachMedisa.editted = {
                    price_label,
                    medisaNormalPrice,
                    suggestPrice : eachColor.suggestedPrice,
                    color: eachColor.color
                }

            } else if (eachMedisa && eachMedisa.type === "variant") {
                let fixedEach_price = null, fixedBox_price = null;

                if (medisaData.price[0] && medisaData.price[1]) {
                    fixedEach_price = parseFloat(medisaData.price[0].priceNumber.replace("$", "").replace(",", ""));
                    fixedBox_price = parseFloat(medisaData.price[1].priceNumber.replace("$", "").replace(",", ""));
                } else if (medisaData.price[0] && (medisaData.price[0].quantity.includes("Unit") || medisaData.price[0].quantity.includes("Units"))) {
                    fixedEach_price = parseFloat(medisaData.price[0].priceNumber.replace("$", "").replace(",", ""));
                } else if (medisaData.price[0] && (!medisaData.price[0].quantity.includes("Unit") || !medisaData.price[0].quantity.includes("Units"))) {
                    fixedBox_price = parseFloat(medisaData.price[0].priceNumber.replace("$", "").replace(",", ""));
                }

                if (eachMedisa.variants && eachMedisa.variants.length > 0) {
                    if (eachMedisa.variants[0].prices['calc_price']) {
                        eachVariantPrice = eachMedisa.variants[0].prices['calc_price'];
                        // offer_price = eachOffer(eachVariantPrice, fixedEach_price)
                        // offer2_price = percent30(eachVariantPrice, fixedEach_price)
                        // let color = calculateOfferPrice(eachVariantPrice, offer_price, offer2_price, true)
                        eachColor = calculate_priceColor(eachVariantPrice, fixedEach_price,true)

                        if (eachColor.color === "text-red-600" || eachColor.color === "bg-red-600") {
                            if (!PriceDifferenceCounter.includes(medisaData.mpn)) {
                                PriceDifferenceCounter.push(medisaData.mpn)
                            }
                        }

                        eachMedisa.variants[0].editted = {
                            eachVariantPrice,
                            suggestPrice: eachColor.suggestedPrice,
                            color: eachColor.color
                        }
                    }
                    // offerVariantBox_price
                    if (eachMedisa.variants.length === 2) {
                        BoxVariantPrice = eachMedisa.variants[1].prices['calc_price'];
                        // offerVariantBox_price = BoxOffer(BoxVariantPrice, fixedBox_price)
                        // offer2VariantBox_price = percent30(BoxVariantPrice, fixedBox_price)
                        let boxColor = calculate_priceColor(BoxVariantPrice, fixedBox_price, true)

                        if (boxColor.color === "text-red-600" || boxColor.color === "bg-red-600") {
                            if (!PriceDifferenceCounter.includes(medisaData.mpn)) {
                                PriceDifferenceCounter.push(medisaData.mpn)
                            }
                        }

                        eachMedisa.variants[1].editted = {
                            BoxVariantPrice,
                            suggestPrice: boxColor.suggestedPrice,
                            color: boxColor.color,
                        }
                    }
                }

            }
        }
        resolve(medisaData)
    })
}


const calculate_priceColor = (productPrice, independencePrice, variant) => {
    console.log("parameter check: ",productPrice,independencePrice)
    if (typeof productPrice === 'number' && typeof independencePrice === 'number') {
        const newPrice = (productPrice * 3) / 100;
        const discountedPrice = independencePrice - newPrice;
        const priceDifference = productPrice - discountedPrice;


        if ( priceDifference <= (independencePrice * 0.03)) {
            return {color: (variant ? "text-green-600" : "bg-green-600"),suggestedPrice: null }; // Medisa price is between 0% and 2% under the independence price
        } else {
            const suggestedPrice = (productPrice - (independencePrice * 0.03)) ; // Suggested price when Medisa price is below 0%
            return {color: (variant ? "text-red-600" : "bg-red-600"), suggestedPrice}; // Medisa price is under 0% from the independence price
        }
    } else {
        console.log('PriceError sec', productPrice, independencePrice);
        return null;
    }
}


const calculateOfferPrice = (price, offerPrice, offer2Price, variant) => {
    if (offer2Price.minPrice && offer2Price.maxPrice) {
        if (price > offer2Price.maxPrice || price < offer2Price.minPrice) {
            return variant ? "text-red-600" : "bg-red-600";
        } else if (price <= offerPrice) {
            return variant ? "text-green-600" : "bg-green-600";
        } else {
            return variant ? "text-orange-600" : "bg-orange-600";
        }
    } else {
        return ""
    }
};

const eachOffer = (productPrice, indipendencePrice) => {
    if (typeof (productPrice) === 'number' && typeof (indipendencePrice) === 'number') {
        const newPrice = productPrice / 100
        const sPrice = indipendencePrice - newPrice
        return parseFloat(sPrice.toFixed(2))
    } else {
        console.log('PriceError')
        return null
    }
}

const BoxOffer = (productPrice, indipendencePrice) => {
    if (typeof (productPrice) === 'number' && typeof (indipendencePrice) === 'number') {
        const newPrice = (productPrice * 2) / 100
        const sPrice = indipendencePrice - newPrice
        return parseFloat(sPrice.toFixed(2))
    } else {
        console.log('PriceError sec', productPrice, indipendencePrice)
        return null
    }
}

const percent30 = (productPrice, indipendencePrice) => {
    if (typeof (productPrice) === 'number' && typeof (indipendencePrice) === 'number') {
        const newPrice = (productPrice * 30) / 100
        const maxPrice = parseFloat((indipendencePrice + newPrice).toFixed(2))
        const minPrice = parseFloat((indipendencePrice - newPrice).toFixed(2))
        return {minPrice, maxPrice}
    } else {
        console.log('PriceError 30', productPrice, indipendencePrice)
        return {minPrice: null, maxPrice: null}
    }
}


module.exports = {medisaEditor}