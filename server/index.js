const axios = require('axios');
axios.defaults.timeout = 10000;
const express = require('express');
const cheerio = require('cheerio');
const multer = require('multer');
const cors = require("cors");
const fs = require("fs");
const {parse} = require("csv-parse");
const Product = require("./models/Data");
const mongoose = require("mongoose");
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();


let Global_all_count = null
let Global_unit_count = null


const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'uploads')
    },
    filename: (req, file, callBack) => {
        callBack(null, `${file.originalname}`)
    }
})
let upload = multer({ dest: 'uploads/' })

const app = express();
const server = http.createServer(app);
const io = socketIo(server)

app.use(cors());



mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("connected")
})





// const ComPrice = []
const getAllProduct = async (code,style,maxRetries = 4) => {
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

            if (style == "price"){
                return [pp , pp2];
            }else if (style == "name"){
                return name;
            }
        }catch(e){
        console.log("errrooooor defaul",`trying ${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        if(maxRetries > 0 ){
        return await getAllProduct(code,style, maxRetries -1)
        }
    }
}



const defaultSite = async (code,maxRetries = 4) => {

    try{
            const DefaulUrl = `${process.env.MAIN_URL}/search.php?search_query=${code}&section=product`
            const res = await axios.get(DefaulUrl);
            const $ = cheerio.load(res.data);
            const price = $('article:first').find('[data-product-price-with-tax]:first').text();
            const price2 = $('article:eq(1)').find('[data-product-price-with-tax]:first').text();
            const name = $('article:first').find('h4.card-title > a').text();
            const name2 = $('article:eq(1)').find('h4.card-title > a').text();
            const sku = $('article:first').find('div.card-text--sku').text().trim();
            const sku2 = $('article:eq(1)').find('div.card-text--sku').text().trim();
            const split = name.split(" ")
            const split2 = name2.split(" ")
            

            pp = parseFloat(price.replace('$',''));
            pp2 = parseFloat(price2.replace('$',''));


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
            }else if(name.includes("Each") && name2.includes("Box") && split[0] == split2[0]){
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
            }else if(name2.includes("Each") && name.includes("Box") && split[0] == split2[0]){
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
        console.log("errrooooor defaul",`trying ${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        if(maxRetries > 0 ){
        return await defaultSite(code, maxRetries -1)
      }
    }
}




const saveToDatabase = async (data) => {
    Global_all_count = data.length;
    for(const everyCode of data){
        try{

        const Pexist = await Product.findOne({mpn: everyCode});

        if(Pexist){
            Pexist.Dprice = await defaultSite(everyCode);
            Pexist.Cprice = await getAllProduct(everyCode,"price");
            Pexist.Name = await getAllProduct(everyCode,"name");
            await Pexist.save();
        }else{

        const pp = new Product({
            mpn: everyCode
        });

        const price1 = await defaultSite(everyCode);
        pp.Dprice = price1;


        const price2 = await getAllProduct(everyCode,"price");
        pp.Cprice = price2;

        const name = await getAllProduct(everyCode,"name");
        pp.Name = name;

        Global_unit_count + 1;

        await pp.save();
    }
}catch(e){
    console.log("save err")
}
    }
}


app.get('/api/loader', (req,res)=>{
    let percent = (Global_unit_count/Global_all_count)*100
    if(Global_unit_count == Global_all_count){
        res.status(200).send({status:true,percent:100})
    }else{
        res.status(300).send({status:false,percent:percent})
    }
})


app.post('/api/csv', upload.single('csv') ,async (req,res)=>{
    const mpns = []; 
    const fileName = req.file;
    Global_all_count = 0
    Global_unit_count = 0

    fs.createReadStream(`./uploads/${fileName.filename}`)
  .pipe(parse({}))
  .on("data", async (row) => {
      mpns.push(row[0])
  })
  .on("end", async () => {
    console.log("finished");
    saveToDatabase(mpns)
        .then(() => res.send('Data saved to the database.'))
        .catch((err) => res.status(500).send('Error saving data to the database.'));
  })
  .on("error", (e) => {
    console.log(e.message);
  }); 

//   fs.unlink('./uploads/${fileName.filename}')
})


app.get('/api/list',async (req,res)=>{
    try{
        const list = await Product.find();
        // await Product.deleteMany({})
        res.status(200).send(list)
    }catch(e){
        res.status(500).send("internal error")
    }
});


const findProductBySku = async (sku,price,maxRetries = 4) => {
    try{
        const response = await axios.get( `https://api.bigcommerce.com/stores/josrcotf/v3/catalog/products?sku=${sku}`,{
            headers:{
                'Content-Type': 'application/json',
                'X-Auth-Token': 'rvut3vv3vwcrdzv2yip4idkcocdxl3'
            }
        });

        const name = response.data.data[0].name;
        const type = response.data.data[0].type;
        const weight = response.data.data[0].weight;
        const price = response.data.data[0].price;
        const salePrice = response.data.data[0].sale_price;
        // console.log()
        let updateJson = {name,type,weight,price}

        

        return updateJson
    }catch(e){
        console.log("findProductBySku Error",`trying ${maxRetries}`)
        await new Promise(resolve => setTimeout(resolve, 3000));
        if(maxRetries > 0 ){
        return await findProductBySku(sku,price, maxRetries -1)
        }
        return null
    }
}

app.get('/api/updateProduct/:sku', async (req,res) => {
    const price = req.query.price;
    const sku = req.params['sku'];
    console.log(price,sku,"node-log")
    const resp = await findProductBySku(sku,price)
    if(resp === null){
        res.status(500).send({
            status: false,
            data: "error finding by sku"
        })
    }
    res.status(200).send({
        status:true,
        data:resp
    });

})


server.listen(2202, ()=>{
    console.log('server is running on 2202')
});


// {
//    name: 'Abbott Nutrition Ensure Powder 850gm Vanilla 2211160 - Each',
//    type: 'physical',
//    weight: 1,
//    price: 52.99
//  }
// sku from Dsite -> search Sku with api -> return price + variant