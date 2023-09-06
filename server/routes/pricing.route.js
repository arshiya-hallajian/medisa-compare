const express = require('express')
const {updateBatchProductController, updateProductController} = require("../controllers/update.controller");
const {csvController} = require("../controllers/csv.controller");
const multer = require("multer");
const router = express.Router()


let upload = multer({ dest: 'uploads/' })


router.post('/csv', upload.single('csv') , csvController);

router.get('/updateProduct/:sku', updateProductController);

router.post('/UpdateBatchProduct', updateBatchProductController);


module.exports = router