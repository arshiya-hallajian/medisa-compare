const express = require('express')
const router = express.Router()
const {NavbarUpdateController, NavbarDataController} = require('../controllers/extract/NavigationData.Controller')
const {getAllProductsController} = require('../controllers/extract/getAllProducts.controller')
const {updateProductController} = require("../controllers/extract/updateProduct.controller");
const {searchController} = require("../controllers/search.controller");
const {mailSender} = require("../services/mailSender");


router.get('/navbar-update', NavbarUpdateController)

router.get('/', NavbarDataController)

router.get('/getAllProducts', getAllProductsController)

router.post('/update', updateProductController)


//search product api
router.get('/search', searchController)


router.post('/sendMail!', async (req, res) => {

    const message = req.body.data

    const mailOptions = {
        from: 'The idea project',
        to: 'arshiyah52@gmail.com',
        subject: message.subject,
        text: `
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title></title>
<style type="text/css">

</style>
</head>
<body>
<h1>your report of search is ready!</h1>
<p>time&date : </p>
<p>searched word: </p>
<p>total founded products: </p>
<p>unregistered medisa products: </p>
<p>prices higher than 30%: </p>
<p>prices lower than 30%: </p>
<p>independence 0 stock product: </p>
</body>
</html>
`
    };


    try {
        await mailSender(mailOptions)
        res.send("ok")
    } catch (e) {
        res.send(e.message)
    }
})


const sendReport = (data) => {
    // const PriceDifferences = []
    // data.forEach((item) => {
    //     if(item.medisa)
    // })
}

module.exports = router