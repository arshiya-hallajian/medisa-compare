const cheerio = require("cheerio");
const axios = require("axios")


const navbar_main_number = async(link) => {
    try{
        const res = await axios.get(link, {
            maxBodyLength: Infinity,
            timeout: 30000
        });
        const $ = cheerio.load(res.data);
        const number = $('#toolbar-amount > span').text();
        // console.log(number,'test')
        const real = number.slice(number.length/2)
        console.log(real)
        return real
    }catch(e){
        console.log(e,"get number error")
    }
}


module.exports = navbar_main_number