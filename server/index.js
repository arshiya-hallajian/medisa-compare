const axios = require('axios');
axios.defaults.timeout = 10000;
const express = require('express');
const cheerio = require('cheerio');
const multer = require('multer');
const cors = require("cors");
const fs = require("fs");
const {parse} = require("csv-parse");
const Product = require("./models/Data");
const http = require('http');
const {Server} = require('socket.io');
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
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: "http://65.109.177.4:443"
    }
})

app.use(cors({
    origin: `http://65.109.177.4:443`,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())



mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("connected")
})



io.on('connection',(Socket) =>{
    Socket.on('mpns',(mpnsData)=>{
        const mpns = mpnsData.array
        console.log(mpnsData.array)
        saveToDatabase(mpns)
    })
    Socket.on('disconnect',()=>{
        console.log("socket disconected")
    })


// const ComPrice = []
const getAllProduct = async (code,style,maxRetries = 0) => {
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
        console.log(`${code} error compare`,`trying ${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        if(maxRetries > 0 ){
        return await getAllProduct(code,style, maxRetries -1)
        }
    }
}



const defaultSite = async (code,maxRetries = 0) => {

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
        console.log(`${code} error defaul`,`trying ${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        if(maxRetries > 0 ){
        return await defaultSite(code, maxRetries -1)
      }
    }
}




const saveToDatabase = async (data) => {
    let counter = 0
    try{
        for(const everyCode of data){

            const Pexist = await Product.findOne({mpn: everyCode});

            if(Pexist){
                Pexist.Dprice = await defaultSite(everyCode);
                Pexist.Cprice = await getAllProduct(everyCode,"price");
                Pexist.Name = await getAllProduct(everyCode,"name");
                counter = counter + 1;
                Socket.emit('loader',{count:counter})
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

})


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
    res.status(200).send(mpns)
    // fs.unlink(`./uploads/${fileName.filename}`,(err) => {
    //     if (err) {
    //       console.error(err);
    //       return;
    //     }
    //     console.log('File deleted successfully');
    //   });
})
.on("error", (e) => {
    console.log(e.message);
}); 
  
})


const updateProductById = async (updateData, maxRetries = 4) => {
    console.log("🤯")
    try{
        const response = await axios.put( `${process.env.BIG_COMMERCE_API}/products/${updateData.id}`,updateData,{
            headers:{
                'Accept' : 'application/json',
                'Content-Type': 'application/json',
                'X-Auth-Token': `${process.env.AUTH_TOKEN}`
            }
        });
        
        return response
    }catch(e){
        console.log("updateProductById Error",`trying ${maxRetries}`)
        await new Promise(resolve => setTimeout(resolve, 3000));
        if(maxRetries > 0 ){
        return await updateProductById(updateData, maxRetries -1)
        }
        return null
    }
}


const findProductBySku = async (sku,Nprice,maxRetries = 4) => {
    
    try{
        
        const response = await axios.get( `${process.env.BIG_COMMERCE_API}/products?sku=${sku}`,{
            headers:{
                'Accept' : 'application/json',
                'Content-Type': 'application/json',
                'X-Auth-Token': `${process.env.AUTH_TOKEN}`
            }
        });
        

        const id = response.data.data[0].id
        const name = response.data.data[0].name;
        const type = response.data.data[0].type;
        const weight = response.data.data[0].weight;
        const salePrice = response.data.data[0].sale_price;
        
        let updateJson
        if(salePrice == 0 ){
            updateJson = {id,name,type,weight,price:Nprice}
        }else{
            updateJson = {id,name,type,weight,sale_price:Nprice}
        }
        
        // console.log(updateJson,"injam ok")
        

        
        const last = await updateProductById(updateJson)

        return last
    }catch(e){
        console.log("findProductBySku Error",`trying ${maxRetries}`)
        await new Promise(resolve => setTimeout(resolve, 6000));
        if(maxRetries > 0 ){
        return await findProductBySku(sku,Nprice, maxRetries -1)
        }
        console.log(e)
        return null
    }
}

app.get('/', (req,res) => {
    res.status(200).send("test")
})

app.get('/api/updateProduct/:sku', async (req,res) => {
    const price = req.query.price;
    const sku = req.params['sku'];
    console.log(price,sku,"node-log")
    const resp = await findProductBySku(sku,price)
    if(resp == null){
        return res.status(500).send({
            status: false,
            data: "error finding by sku"
        })
    }else{
        
        res.status(200).json({
            status:true,
            data:resp.data
        });
    }

})

app.post('/api/UpdateBatchProduct', async (req,res) => {
    const ans = []
    try{
        console.log(req.body)
        for(const product of req.body){
        const sku = product.sku;
        const price = product.price;
        console.log(price,sku,"node-log")
        const resp = await findProductBySku(sku,price)
        if(resp === null){
            ans.push("false")
        }else{
            ans.push("true")
        }
    };
    res.status(200).send({
        status:true,
        data:ans
    });


    }catch(e){
        res.status(400).send({
            status:false,
            data:"error happend"
        });
    }
    
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