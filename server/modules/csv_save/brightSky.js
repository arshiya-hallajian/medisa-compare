const axios = require("axios");
const compareNames = require("../../utils/compareNames");
const {getPageResultByLink} = require("./teammed");
const cheerio = require("cheerio");



const searchInBrightSky = async (search) => {
    try {
        if (search) {
            const {
                data,
                status
            } = await axios.get(`https://brightsky.com.au/wp-content/plugins/ajax-search-for-woocommerce-premium/includes/Engines/TNTSearchMySQL/Endpoints/search.php?s=${search}`);
            if (status === 200) {
                return data.suggestions
            }
        }
    } catch (e) {
        console.log("error in search_in_teammed: " + e.message);
        return null
    }
}

const brightSky_Search = async (search,name) => {
    try{
        const search_in_brightSky_result = await searchInBrightSky(search);

        if (!search_in_brightSky_result || search_in_brightSky_result.length === 0) {
            console.log('no link in function')
            return null
        }

        const allData = []

        for (const suggest of search_in_brightSky_result){



            for (let i = 0; i < search_in_brightSky_result.length; i++) {
                const suggest = search_in_brightSky_result[i];
                if (!compareNames(suggest.value, name, 0.4)) {
                    // Remove the element from the array
                    search_in_brightSky_result.splice(i, 1);
                    // Adjust the index to account for the removed element
                    i--;
                }
            }


            const pageResult = await getPageResultByLink(suggest.url)


            const $ = cheerio.load(pageResult);

            const url =  suggest.url;

            const title = $('#main-content > div.et-l.et-l--body div.et_pb_module.et_pb_text.et_pb_text_1_tb_body.et_pb_text_align_left.et_pb_bg_layout_light > div > h1:first').text();

            const price = $('#main-content > div.et-l.et-l--body span.woocommerce-Price-amount.amount > bdi:first').text()

            const stockStatusText = $('#main-content > div.et-l.et-l--body div.et_pb_module.et_pb_wc_stock.et_pb_wc_stock_0_tb_body.et_pb_bg_layout_ > div > p:first').text()

            let stockStatus = null;

            if (stockStatusText.toLowerCase().includes("in stock")) {
                stockStatus = true;
            } else if (stockStatusText.toLowerCase().includes("Available on backorder")) {
                stockStatus = "limited";
            } else if (stockStatusText.toLowerCase().includes("out of stock")) {
                stockStatus = false;
            }else{
                stockStatus = stockStatusText.toLowerCase();
            }

            const unitInPackaging = $('#main-content > div.et-l.et-l--body div > p > span.uom:first').text()


            allData.push({
                url,
                title,
                price,
                stockStatus,
                unitInPackaging
            })

        }


        return allData;
    } catch (e) {
        console.log("error in brightSky_search: ", e.message)
        return null
    }
}



module.exports = {brightSky_Search}