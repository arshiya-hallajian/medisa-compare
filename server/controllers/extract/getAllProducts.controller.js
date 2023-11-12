const {productScrape} = require("../../modules/productScrap.modules");


module.exports.getAllProductsController = (req,res) => {
    const url = req.query.url
    if(req.query.url !== ""){
    const io = req.app.get('socketIo')
    console.log(url,"its ok")
        productScrape(url,io)
        res.send("Ok :)")
    }else{
        res.status(400).send("bad request")
    }
}