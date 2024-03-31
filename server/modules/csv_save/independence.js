const {All_pages_link_scrap, indPage_price_scrap, indPage_stock_scrap} = require("../../controllers/search.controller");
const {getPageResultByLink} = require("./teammed");
const cheerio = require("cheerio");
const compareNames = require("../../utils/compareNames");


const independence_search = async (search, name) => {
    try {
        const array_of_links = await All_pages_link_scrap(search);

        if (!array_of_links || array_of_links.length === 0) {
            console.log('no link in function')
            return null
        }

        const arrayOfData = []

        for (const everyLink of array_of_links) {
            const page_result = await getPageResultByLink(everyLink);

            const $ = cheerio.load(page_result);

            const main_div = $('div.column.main')

            const title = main_div.find('h1.page-title > span').text()
            const price = indPage_price_scrap($, main_div);
            const stocks = indPage_stock_scrap($);
            // console.log(price)
            const url = everyLink;

            if (compareNames(title, name, 0.2)) {
                arrayOfData.push({title, price, stocks, url})
            }
        }
        return arrayOfData
    } catch (e) {
        console.log("error in independence_search: " + e.message);
        return null
    }
}


module.exports = {independence_search}