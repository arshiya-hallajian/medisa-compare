const express = require('express')
const router = express.Router()
const {NavbarUpdateController, NavbarDataController} = require('../controllers/extract/NavigationData.Controller')
const {getAllProductsController} = require('../controllers/extract/getAllProducts.controller')
const {updateProductController} = require("../controllers/extract/updateProduct.controller");
const {searchController} = require("../controllers/search.controller");
const bot = require("../services/telegraf");


router.get('/navbar-update', NavbarUpdateController)

router.get('/', NavbarDataController)

router.get('/getAllProducts', getAllProductsController)

router.post('/update', updateProductController)


//search product api
router.get('/search', searchController)


router.post('/sendReport', async (req, res) => {

    const PriceDifferenceCounter = req.body.price
    const StockCounter = req.body.stock
    const title = req.body.title
    console.log(PriceDifferenceCounter, StockCounter)
    const telIds = ['111236111',"5007806275"]
    // myTest()

    for (const id of telIds) {
        await bot.telegram.sendMessage(id,
            `
*${title}* 
        
products that have different price:
${!PriceDifferenceCounter ? "nothing" : (
                PriceDifferenceCounter.map(mpn => {
                    return (`${mpn}\n`)
                })
            )}
-----------------------------
products that doesnt have stock:
${!StockCounter ? "nothing" : (
                StockCounter.map(mpn => {
                    return (`${mpn}`);
                })
            )}
        `, {parse_mode: "Markdown"})
        res.send("ok")

    }
})


module.exports = router