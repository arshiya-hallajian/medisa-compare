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
                let medisaNormalPrice;
                let priceLabel;
                let eachColor;

                medisaNormalPrice = eachMedisa.prices['calc_price'];

                const name = eachMedisa.name.toLowerCase();
                if (name.includes("each")) {
                    priceLabel = "each";
                    if (medisaData.price[0] && (medisaData.price[0].quantity.includes("Unit") || medisaData.price[0].quantity.includes("Units"))) {
                        const fixedPrice = parseFloat(medisaData.price[0].priceNumber.replace("$", "").replace(",", ""));
                        eachColor = calculate_priceColor(medisaNormalPrice, fixedPrice, false);
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
                    priceLabel = eachMedisa.name;
                    const priceIndex = medisaData.price.findIndex(price => price.title.toLowerCase().includes("box") || price.title.toLowerCase().includes("pack") || price.title.toLowerCase().includes("pcs") || price.title.toLowerCase().includes("pkt") || price.title.toLowerCase().includes("pkts") || price.title.toLowerCase().includes("carton") || price.title.toLowerCase().includes("jar") || price.title.toLowerCase().includes("jars"));

                    if (priceIndex !== -1) {
                        const fixedPrice = parseFloat(medisaData.price[priceIndex].priceNumber.replace("$", "").replace(",", ""));
                        eachColor = calculate_priceColor(medisaNormalPrice, fixedPrice, false);
                    } else {
                        const fixedPrice = parseFloat(medisaData.price[0].priceNumber.replace("$", "").replace(",", ""));
                        eachColor = calculate_priceColor(medisaNormalPrice, fixedPrice, false);
                    }
                } else {
                    priceLabel = "no-label";
                }

                if (eachColor.color === "text-red-600" || eachColor.color === "bg-red-600") {
                    PriceDifferenceCounter.push(medisaData.mpn);
                }

                eachMedisa.editted = {
                    priceLabel,
                    medisaNormalPrice,
                    suggestPrice: eachColor.suggestedPrice,
                    color: eachColor.color
                };
            } else if (eachMedisa && eachMedisa.type === "variant") {
                let fixedEachPrice = null;
                let fixedBoxPrice = null;

                const boxKeywords = ["box", "carton", "pack", "jar", "jars", "pcs", "pkt", "pkts"]; // Add more keywords as needed

                if (medisaData.price.length === 2) {
                    fixedEachPrice = parseFloat(medisaData.price[0].priceNumber.replace("$", "").replace(",", ""));
                    fixedBoxPrice = parseFloat(medisaData.price[1].priceNumber.replace("$", "").replace(",", ""));
                } else if (medisaData.price.length === 1) {
                    if (boxKeywords.some(keyword => medisaData.price[0].title.toLowerCase().includes(keyword))) {
                        fixedBoxPrice = parseFloat(medisaData.price[0].priceNumber.replace("$", "").replace(",", ""));
                    } else {
                        fixedEachPrice = parseFloat(medisaData.price[0].priceNumber.replace("$", "").replace(",", ""));
                    }
                }

                if (eachMedisa.variants && eachMedisa.variants.length > 0) {
                    let eachVariantPrice = eachMedisa.variants[0].prices['calc_price'];
                    if (fixedEachPrice) {

                        let eachColor = calculate_priceColor(eachVariantPrice, fixedEachPrice, true);

                        if (eachColor.color === "text-red-600" || eachColor.color === "bg-red-600") {
                            if (!PriceDifferenceCounter.includes(medisaData.mpn)) {
                                PriceDifferenceCounter.push(medisaData.mpn);
                            }
                        }

                        eachMedisa.variants[0].editted = {
                            eachVariantPrice,
                            suggestPrice: eachColor.suggestedPrice,
                            color: eachColor.color
                        };
                    } else {
                        eachMedisa.variants[0].editted = {
                            eachVariantPrice,
                            suggestPrice: null,
                            color: "text-orange-600",
                        };
                    }

                    if (eachMedisa.variants.length === 2) {
                        let boxVariantPrice = eachMedisa.variants[1].prices['calc_price'];

                        if (fixedBoxPrice) {
                            let boxColor = calculate_priceColor(boxVariantPrice, fixedBoxPrice, true);

                            if (boxColor.color === "text-red-600" || boxColor.color === "bg-red-600") {
                                if (!PriceDifferenceCounter.includes(medisaData.mpn)) {
                                    PriceDifferenceCounter.push(medisaData.mpn);
                                }
                            }

                            eachMedisa.variants[1].editted = {
                                boxVariantPrice,
                                suggestPrice: boxColor.suggestedPrice,
                                color: boxColor.color,
                            };
                        } else {
                            eachMedisa.variants[1].editted = {
                                boxVariantPrice,
                                suggestPrice: null,
                                color: "text-orange-600",
                            };
                        }
                    }
                }
            }

        }
        resolve(medisaData)
    })
}


const calculate_priceColor = (productPrice, independencePrice, variant) => {
    // console.log("parameter check: ", productPrice, independencePrice)
    if (typeof productPrice === 'number' && typeof independencePrice === 'number') {
        const newPrice = (productPrice * 3) / 100;
        const discountedPrice = independencePrice - newPrice;
        const priceDifference = productPrice - discountedPrice;


        if (priceDifference <= (independencePrice * 0.03)) {
            return {color: (variant ? "text-green-600" : "bg-green-600"), suggestedPrice: null}; // Medisa price is between 0% and 2% under the independence price
        } else {
            const suggestedPrice = (productPrice - (independencePrice * 0.03)); // Suggested price when Medisa price is below 0%
            return {color: (variant ? "text-red-600" : "bg-red-600"), suggestedPrice}; // Medisa price is under 0% from the independence price
        }
    } else {
        console.log('PriceError sec', productPrice, independencePrice);
        return null;
    }
}


module.exports = {medisaEditor}