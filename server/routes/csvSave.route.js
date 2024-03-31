const express = require('express');
const multer = require("multer");
const router = express.Router();
const {csvSaver, csvDatabaseRead, csvSaveUpdate} = require("../controllers/csvSaver.controller");

let upload = multer({ dest: 'uploads/' })


router.post('/', upload.single('csv'), csvSaver)

router.put('/update', csvSaveUpdate)

router.get("/", csvDatabaseRead)


module.exports = router