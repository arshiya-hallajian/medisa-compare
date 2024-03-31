const axios = require('axios');
const cheerio = require("cheerio")
const compareNames = require("../../utils/compareNames");
const {getPageResultByLink} = require("./teammed");


const searchInMedShop = async (search) => {
    try {
        const data = JSON.stringify({
            "requests": [{
                "indexName": "products",
                "params": `clickAnalytics=true&facets=%5B%22vendor%22%2C%22inventory_available%22%2C%22product_type%22%2C%22meta.algolia_filter.genders%22%2C%22meta.algolia_filter.series%22%2C%22meta.algolia_filter.colours%22%2C%22meta.algolia_filter.styles%22%2C%22options.size%22%2C%22meta.filter.number_of_pockets%22%5D&filters=NOT%20tags%3A%20'OPTIONS_HIDDEN_PRODUCT'&highlightPostTag=__%2Fais-highlight__&highlightPreTag=__ais-highlight__&maxValuesPerFacet=1000&page=0&query=${search}&tagFilters=`
            }]
        });
        const response = await axios.post(`https://gxvne1fkux-3.algolianet.com/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.20.0)%3B%20Browser%20(lite)%3B%20instantsearch.js%20(4.56.1)%3B%20react%20(18.2.0)%3B%20react-instantsearch%20(6.44.2)%3B%20react-instantsearch-hooks%20(6.44.2)%3B%20JS%20Helper%20(3.13.0)&x-algolia-api-key=47e5e2edad367912a39f28e92181ef39&x-algolia-application-id=GXVNE1FKUX`, data);
        return response.data.results[0].hits;
    } catch (e) {
        console.log("error in search_in_medShop: " + e.message);
        return null
    }
}


const products_link_on_Search_page = async (result, name) => {
    const $ = cheerio.load(result);

    const productLinks = [];
    const selectedProduct = $('div.card-body > h4 > a');

    selectedProduct.each((index, element) => {
        if (compareNames($(element).text(), name, 0.3)) {
            const pt = $(element).attr('href');
            productLinks.push(pt)
        }
    })

    return productLinks

}


const medShop_search = async (search, name) => {

    try {

        const searchResult = await searchInMedShop(search);

        const products_links = []

        if (!searchResult || searchResult.length === 0) {
            console.log('no results found')
            return null
        } else if (searchResult.length > 0) {
            for (const eproduct of searchResult) {
                products_links.push(`https://www.medshop.com.au/products/${eproduct.handle}`)
            }
        }


        const arrayOfData = []

        for (const everyLink of products_links) {

            const page_result = await getPageResultByLink(`${everyLink}/?_data=routes%2F%28%24lang%29.products.%24handle`);

            // console.log(page_result.product.variants)

            // console.log(JSON.parse(page_result))
            const sepratorIndex = page_result.indexOf('\n');
            const firstJson = page_result.substring(0, sepratorIndex)
            const object = JSON.parse(firstJson)


            for (const variant of object.product.variants.nodes) {
                // console.log(variant)

                const price = variant.price.amount;
                const title = object.product.handle;
                const type = variant.title;
                const stocks = variant.availableForSale ? "yes" : "no";
                const url = everyLink;

                let unitInPackaging = null
                if (!variant.custom_measure_unit) {
                    unitInPackaging = "each";
                } else {
                    unitInPackaging = variant.custom_measure_unit.value.toLowerCase();
                }

                arrayOfData.push({
                    title,
                    price,
                    type,
                    stocks,
                    url,
                    unitInPackaging
                })

            }


        }
        return arrayOfData
    } catch (e) {
        console.log("error in med shop:", e.message)
        return null
    }

}


module.exports = {medShop_search}