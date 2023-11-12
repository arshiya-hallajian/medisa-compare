const express = require('express')
const router = express.Router()
const {NavbarUpdateController, NavbarDataController} = require('../controllers/extract/NavigationData.Controller')
const {getAllProductsController} = require('../controllers/extract/getAllProducts.controller')
const {updateProductController} = require("../controllers/extract/updateProduct.controller");
const {searchController} = require("../controllers/search.controller");


router.get('/navbar-update',NavbarUpdateController)

router.get('/', NavbarDataController)

router.get('/getAllProducts', getAllProductsController)

router.post('/update', updateProductController)


//search product api
router.get('/search', searchController)

module.exports = router