const axios = require('axios');
const express = require('express');
const cheerio = require('cheerio');
const multer = require('multer');
const cors = require("cors");
const fs = require("fs");
const {parse} = require("csv-parse");
const Product = require("./models/Data");
const mongoose = require("mongoose");
require('dotenv').config();





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

app.use(cors());



mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("connected")
})





// const ComPrice = []
const getAllProduct = async (code,style,maxRetries = 3) => {
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



const defaultSite = async (code,maxRetries = 3) => {

    try{
            const DefaulUrl = `${process.env.MAIN_URL}/search.php?search_query=${code}&section=product`
            const res = await axios.get(DefaulUrl);
            const $ = cheerio.load(res.data);
            const price = $('article:first').find('[data-product-price-with-tax]:first').text();
            const price2 = $('article:eq(1)').find('[data-product-price-with-tax]:first').text();
            const name = $('article:first').find('h4.card-title > a').text();
            const name2 = $('article:eq(1)').find('h4.card-title > a').text();
            const split = name.split(" ")
            const split2 = name2.split(" ")
            

            pp = parseFloat(price.replace('$',''));
            pp2 = parseFloat(price2.replace('$',''));


            if(!price2){
                console.log([pp,"null"],1)
                return [pp,null]
            }else if((name.includes("Each") | name.includes("Box")) && split[0] !== split2[0]){
                if(name.includes("Each")){
                    console.log([pp,"null"],2 ,split[0], split2[0])
                    return [pp,null]
                }else if(name.includes("Box")){
                    console.log(["null",pp],2 ,split[0], split2[0])
                    return [null,pp]
                }
            }else if(name.includes("Each") && name2.includes("Box") && split[0] == split2[0]){
                console.log([pp, pp2],3)
                return [pp, pp2]
            }else if(name2.includes("Each") && name.includes("Box") && split[0] == split2[0]){
                console.log([pp2, pp],4)
                return [pp2, pp]
            }else if(name.includes("Each")){
                console.log([pp,null],5)
                return [pp,null]
            }else if(name.includes("Box")){
                console.log([null,pp],6)
                return [null,pp]
            }

    }catch(e){
        console.log("errrooooor defaul",`trying ${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        if(maxRetries > 0 ){
        return await defaultSite(code, maxRetries -1)
      }
    }
}




const saveToDatabase = async (data) => {
    for(const everyCode of data){
        const pp = new Product({
            mpn: everyCode
        });

        const price1 = await defaultSite(everyCode);
        pp.Dprice = price1;


        const price2 = await getAllProduct(everyCode,"price");
        pp.Cprice = price2;

        const name = await getAllProduct(everyCode,"name");
        pp.Name = name;


        await pp.save();
    }
}




app.post('/api/csv', upload.single('csv') ,async (req,res)=>{
    const mpns = []; 
    const fileName = req.file;

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

  fs.unlink('./uploads/${fileName.filename}')
})


app.get('/api/list',async (req,res)=>{
    try{
        const list = await Product.find();
        await Product.deleteMany({})
        res.status(200).send(list)
    }catch(e){
        res.status(500).send("internal error")
    }
});




app.listen(2202, async ()=>{
    console.log('server is running on 2202')
});