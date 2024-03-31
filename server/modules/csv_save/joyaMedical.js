const axios = require('axios');
const FormData = require('form-data');
const cheerio = require("cheerio");
const compareNames = require("../../utils/compareNames");
const {getPageResultByLink} = require("./teammed");


const searchInJoya = async (search) => {
    try {

        const formData = new FormData();
        formData.append("keyword", search);
        formData.append("typedata", "json");

        if (search) {
            const response = await axios.post(`https://joyamedicalsupplies.com.au/?wc-ajax=aws_action`, formData)

            const responseData = response.data;

            return responseData.products;

        }
    } catch (e) {
        console.log("error in joya medical: " + e.message);
        return null
    }
}


const joyaMedical_search = async (search, name) => {

    const search_joya_result = await searchInJoya(search)


    if (!search_joya_result || search_joya_result.length === 0) {
        console.log('no link in function')
        return null
    }


    const allData = []

    for (const searchResult of search_joya_result) {

        for (let i = 0; i < search_joya_result.length; i++) {
            const suggest = search_joya_result[i];
            if (!compareNames(suggest.title, name, 0.2)) {
                search_joya_result.splice(i, 1);
                i--;
            }
        }


        const pageResult = await getPageResultByLink(searchResult.link);


        const $ = cheerio.load(pageResult);


        const link = searchResult.link;

        const title = $('div.mf-entry-product-header > div > h1.product_title').text();


        const unitText = $('table > thead > tr > th:first').text().toLowerCase();


        const extractPrice = (type) => {
            let main;
            if (type === 'each') {
                if ($('tbody > tr.pvt-tr:first td:eq(0)').text().toLowerCase().includes('each')) {
                    main = $('tbody > tr.pvt-tr:first');
                }else{
                    main = $('tbody > tr.pvt-tr:eq(1)');
                }

            } else if (type === 'box') {
                if (!$('tbody > tr.pvt-tr:first td:eq(0)').text().toLowerCase().includes('each')) {
                    main = $('tbody > tr.pvt-tr:first');
                }else{
                    main = $('tbody > tr.pvt-tr:eq(1)');
                }
            }
            if (main.find('td:eq(1) p.gst-free-wrap').length > 0) {
                const unit = main.find('td:eq(0)').text();
                const priceString = main.find('td:eq(1) bdi').text();


                if (!unit || !priceString) {
                    return null;
                }

                const exGst = priceString;
                const incGst = "free";
                //
                return {unit, exGst, incGst};
            } else {
                const unit = main.find('td:eq(0)').text();
                const priceString = main.find('td:eq(1)').text();


                if (!unit || !priceString) {
                    return null;
                }

                const regex = /Ex\. GST : \$([\d.]+)Inc\. GST : \$([\d.]+)/;
                const match = priceString.match(regex);

                if (!match) {
                    return null;
                }

                const exGst = match[1];
                const incGst = match[2];

                return {unit, exGst, incGst};
            }
        }

        let eachPrice = null;
        let boxPrice = null;
        console.log(unitText)
        if (unitText.includes('each') && (unitText.includes('box') || unitText.includes('pkt'))) {
            eachPrice = extractPrice("each");
            boxPrice = extractPrice("box");
        } else if (unitText.includes('each')) {
            eachPrice = extractPrice('each');
        } else if (unitText.includes('box') || unitText.includes("pkt")) {
            boxPrice = extractPrice('box');
        }


        allData.push({title, link, eachPrice, boxPrice})
    }

    return allData
}


module.exports = {joyaMedical_search}