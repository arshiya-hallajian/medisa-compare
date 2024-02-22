const express = require('express')
const {updateBatchProductController, updateProductController} = require("../controllers/pricing/update.controller");
const {csvController} = require("../controllers/pricing/csv.controller");
const multer = require("multer");
const {csvSaver} = require("../controllers/csvSaver.controller");
const router = express.Router()


let upload = multer({ dest: 'uploads/' })


router.post('/csv', upload.single('csv') , csvController);

router.get('/updateProduct/:sku', updateProductController);

router.post('/UpdateBatchProduct', updateBatchProductController);


module.exports = router