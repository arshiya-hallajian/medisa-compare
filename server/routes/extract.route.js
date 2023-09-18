const express = require('express')
const router = express.Router()
const {NavbarUpdateController, NavbarDataController} = require('../controllers/NavigationData.Controller')
const {getAllProductsController} = require('../controllers/getAllProducts.controller')


router.get('/navbar_update',NavbarUpdateController)

router.get('/', NavbarDataController)

router.get('/getAllProducts', getAllProductsController)

module.exports = router