
const axios = require('axios');
const FormData = require('form-data');
const cheerio = require("cheerio");
const compareNames = require("../../utils/compareNames");
const {getPageResultByLink} = require("./teammed");




const searchInJoya = async (search) => {
    try {

        const formData = new FormData();
        formData.append("keyword",search);
        formData.append("typedata","json");

        if(search){
            const response = await axios.post(`https://joyamedicalsupplies.com.au/?wc-ajax=aws_action`,formData)

            const responseData = response.data;

            return responseData.products;

        }
    }catch (e) {
        console.log("error in joya medical: " + e.message);
        return null
    }
}



const joyaMedical_search = async (search, name) => {

    const search_joya_result = await searchInJoya(search)


    if(!search_joya_result || search_joya_result.length === 0){
        console.log('no link in function')
        return null
    }

    console.log(name);


    const allData = []

    for(const searchResult of search_joya_result){

        for (let i = 0; i < search_joya_result.length; i++) {
            const suggest = search_joya_result[i];

            // console.log("tesssssssssssssst", suggest.title , name)
            if (!compareNames(suggest.title, name, 0.2)) {
                // Remove the element from the array
                search_joya_result.splice(i, 1);
                // Adjust the index to account for the removed element
                i--;
            }
        }


        const pageResult = await getPageResultByLink(searchResult.link);


        const $ = cheerio.load(pageResult);



        const link = searchResult.link;

        const title = $('div.mf-entry-product-header > div > h1.product_title').text();



        const unitText = $('table > thead > tr > th:first').text().toLowerCase();




        const extractPrice = (element) => {
            const unit = element.find('td:eq(0)').text();
            const priceString = element.find('td:eq(1)').text();

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

            return { unit, exGst, incGst };
        }


        const eachPrice = extractPrice($('tbody > tr.pvt-tr:first'));
        const boxPrice = extractPrice($('tbody > tr.pvt-tr:eq(1)'));





        console.log(title, link, eachPrice, boxPrice)



    }
        console.log("----------------------------------")



}


module.exports = {joyaMedical_search}