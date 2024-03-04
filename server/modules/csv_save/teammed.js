const axios = require('axios')
const cheerio = require("cheerio");
const compareNames = require("../../utils/compareNames");


const search_in_teammed = async (search) => {
    try {
        if (search) {
            const response = await axios.get(`https://www.teammed.com.au/shop/?page=search&searchTerm=${search}`);
            return response.data
        }
    } catch (e) {
        console.log("error in search_in_teammed: " + e.message);
        return null
    }
}


const products_link_on_Search_page = (result, name) => {
    const $ = cheerio.load(result);
    const productLinks = [];

    const product_link = $('div.tm__product__link-container');


    product_link.each((index, elm) => {
        if (compareNames($(elm).find('a h3').text(), name, 0.3)) {
            const pt = $(elm).find('a').attr('href');
            productLinks.push(pt)
        }
    })

    return productLinks
}


const getPageResultByLink = async (link) => {
    try{
        const {data, status} = await axios.get(link);
        if(status === 200){
            return data
        }

    }catch (e) {
        console.log("error happening in getPageResultByLink: ", e.message)
        return null
    }
}



const teammed_search = async (mpn, name) => {
    try {


        const search_teammed_result = await search_in_teammed(mpn);
        const products_links = products_link_on_Search_page(search_teammed_result, name);


        if (!products_links || products_links.length === 0) {
            console.log('no link in function')
            return null
        }

        const arrayOfData = []

        for(const everyLink of products_links){

            const pageResult = await getPageResultByLink(everyLink);

            const $ = cheerio.load(pageResult);


            const url  = everyLink;

            const title = $('div.row div.secondary-text > h3').text();

            const price = $('#main_content div.d-flex.align-items-end > span.h1.fw-bolder.primary-text.m-0.px-2').text();

            const gstCheck = $('#main_content div.d-flex.align-items-end > span.small-text.primary-text').text()


            let gst = true;
            if(gstCheck.includes('free')){
                gst = false;
            }


            const stockStatusText = $('#main_content > div > div div.mobile-price-col.col-sm-6 div.d-flex.py-2 p').text();

            let stockStatus = null;

            if (stockStatusText.toLowerCase().includes("in stock")) {
                stockStatus = true;
            } else if (stockStatusText.toLowerCase().includes("stock 1-7 days")) {
                stockStatus = "limited";
            } else if (stockStatusText.toLowerCase().includes("out of stock")) {
                stockStatus = false;
            }else{
                stockStatus = stockStatusText.toLowerCase()
            }


            // const stockLimited = $('#main_content > div > div div.mobile-price-col.col-sm-6 div.d-flex.py-2.text-warning')

            const unitInPackaging = $('#main_content > div > div  div.d-flex.flex-column.tm__pd_attr > span:nth-child(2)').text().slice(6)



            arrayOfData.push(
                {
                    url,
                    title,
                    price,
                    gst,
                    stockStatus,
                    unitInPackaging
                }
            )


        }

        return arrayOfData
        // for(const each)
    } catch (e) {
        console.log("error in teammed_search: ", e.message)
        return null
    }

}


module.exports = {search_in_teammed, teammed_search, getPageResultByLink}