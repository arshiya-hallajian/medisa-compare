// const {Socket} = require("socket.io");
const axios = require("axios");
const cheerio = require("cheerio");
const Product = require("../models/pricing.model");
// const {compSite} = require('pricingScap.modules')

const compSite = async (code, style, maxRetries = 0) => {
    try{
        const url = `${process.env.COMP_URL}/catalogsearch/result/?q=${code}`
        const res = await axios.get(url);
        const $ = cheerio.load(res.data);
        const productLink = $('a.product-item-link').attr('href');
        const insideProduct = await axios.get(productLink);
        const $1 = cheerio.load(insideProduct.data);
        const price = $1('div.packet-price').find('span.price').text();
        const price2 = $1('div.carton-price').find('span.price').text();
        const name = $1('h1.page-title').find("span.base").text();
        const pp = parseFloat(price.replace("$",''));
        const pp2 = parseFloat(price2.replace("$",''));
        console.log(pp , pp2,"Cprice");

        if (style === "price"){
            return [pp , pp2];
        }else if (style === "name"){
            return name;
        }
    }catch(e){
        console.log(`${code} error compare`,`trying ${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        if(maxRetries > 0 ){
            return await compSite(code,style, maxRetries -1)
        }
    }
}



const defaultSite = async (code,maxRetries = 0) => {

    try{
        const DefaultUrl = `${process.env.MAIN_URL}/search.php?search_query=${code}&section=product`
        const res = await axios.get(DefaultUrl);
        const $ = cheerio.load(res.data);
        const jf = $('article:first');
        const sec = $('article:eq(1)');
        const price = jf.find('[data-product-price-with-tax]:first').text();
        const price2 = sec.find('[data-product-price-with-tax]:first').text();
        const name = jf.find('h4.card-title > a').text();
        const name2 = sec.find('h4.card-title > a').text();
        const sku = jf.find('div.card-text--sku').text().trim();
        const sku2 = sec.find('div.card-text--sku').text().trim();
        const split = name.split(" ")
        const split2 = name2.split(" ")


        const pp = parseFloat(price.replace('$',''));
        const pp2 = parseFloat(price2.replace('$',''));


        if(!price2){
            console.log([pp,"null"],1)
            return [{
                price: pp,
                sku: sku
            },null]
        }else if((name.includes("Each") | name.includes("Box")) && split[0] !== split2[0]){
            if(name.includes("Each")){
                console.log([{
                    price: pp,
                    sku: sku
                },"null"],2 ,split[0], split2[0])
                return [{
                    price: pp,
                    sku: sku
                },null]
            }else if(name.includes("Box")){
                console.log(["null",{
                    price: pp,
                    sku: sku
                }],2 ,split[0], split2[0])
                return [null,{
                    price: pp,
                    sku: sku
                }]
            }
        }else if(name.includes("Each") && name2.includes("Box") && split[0] === split2[0]){
            console.log([{
                price: pp,
                sku: sku
            }, {
                price: pp2,
                sku: sku2
            }],3)
            return [{
                price: pp,
                sku: sku
            }, {
                price: pp2,
                sku: sku2
            }]
        }else if(name2.includes("Each") && name.includes("Box") && split[0] === split2[0]){
            console.log([{
                price: pp2,
                sku: sku2
            }, {
                price: pp,
                sku: sku
            }],4)
            return [{
                price: pp2,
                sku: sku2
            }, {
                price: pp,
                sku: sku
            }]
        }else if(name.includes("Each")){
            console.log([{
                price: pp,
                sku: sku
            },null],5)
            return [{
                price: pp,
                sku: sku
            },null]
        }else if(name.includes("Box")){
            console.log([null,{
                price: pp,
                sku: sku
            }],6)
            return [null,{
                price: pp,
                sku: sku
            }]
        }

    }catch(e){
        console.log(`${code} error default`,`trying ${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        if(maxRetries > 0 ){
            return await defaultSite(code, maxRetries -1)
        }
    }
}




const saveToDatabase = async (data, Socket) => {
    let counter = 0
    try{
        for(const everyCode of data){

            const P_exist = await Product.findOne({mpn: everyCode});

            if(P_exist){
                P_exist.Dprice = await defaultSite(everyCode);
                P_exist.Cprice = await compSite(everyCode,"price");
                P_exist.Name = await compSite(everyCode,"name");
                counter = counter + 1;
                Socket.emit('loader',{count:counter})
                await P_exist.save();
            }else{

                const pp = new Product({
                    mpn: everyCode
                });

                pp.Dprice = await defaultSite(everyCode);


                pp.Cprice = await compSite(everyCode, "price");

                pp.Name = await compSite(everyCode, "name");


                counter = counter+1
                Socket.emit('loader',{count:counter})
                await pp.save();
            }
        }
        const list = await Product.find();
        await Product.deleteMany({})
        Socket.emit('data',{data:list})

    }catch(e){
        console.log("save err")
    }
}


module.exports = {compSite, defaultSite, saveToDatabase}