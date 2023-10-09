export const eachOffer = (productPrice, indipendencePrice) => {

    if (typeof (productPrice) === 'number' && typeof (indipendencePrice) === 'number') {
        const newPrice = productPrice / 100
        const sPrice = indipendencePrice - newPrice
        return parseFloat(sPrice.toFixed(2))
    } else {
        console.log('PriceError')
    }
}

export const BoxOffer = (productPrice, indipendencePrice) => {
    if (typeof (productPrice) === 'number' && typeof (indipendencePrice) === 'number') {
        const newPrice = (productPrice * 2) / 100
        const sPrice = indipendencePrice - newPrice
        return parseFloat(sPrice.toFixed(2))
    } else {
        console.log('PriceError sec')
    }
}

export const percent30 = (productPrice, indipendencePrice) => {

    if (typeof (productPrice) === 'number' && typeof (indipendencePrice) === 'number') {
        //42.90
        const newPrice = (productPrice * 30) / 100 //12.87
        const maxPrice = parseFloat((indipendencePrice + newPrice).toFixed(2))
        const minPrice = parseFloat((indipendencePrice - newPrice).toFixed(2))
        return {minPrice, maxPrice}
    } else {
        console.log('PriceError 30')
    }
}
