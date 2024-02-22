const express = require('express');
const multer = require("multer");
const router = express.Router();
const {csvSaver, csvDatabaseRead} = require("../controllers/csvSaver.controller");

let upload = multer({ dest: 'uploads/' })


router.post('/', upload.single('csv'), csvSaver)

router.get("/", csvDatabaseRead)


module.exports = router