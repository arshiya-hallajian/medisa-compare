export const calculateOfferPrice = (price, offerPrice, offer2Price, priceDifference) => {
    if (offer2Price.minPrice && offer2Price.maxPrice) {
        if (price > offer2Price.maxPrice || price < offer2Price.minPrice) {
            priceDifference.push()
            return "bg-red-600";
        } else if (price <= offerPrice) {
            return "bg-green-600";
        } else {
            return "bg-orange-600";
        }
    }else{
        return ""
    }
};
