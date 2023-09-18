const {productScrape} = require("../modules/productScrap.modules");


module.exports.getAllProductsController =  (req,res) => {
    const url = req.query.url
    if(req.query.url !== ""){
    const io = req.app.get('socketIo')
    console.log(url,"its ok")
        productScrape(url,io)
        res.send("Ok :)")
    }

    // io.on('extract-url',(url) => {
    //     console.log(url)
    // })
}