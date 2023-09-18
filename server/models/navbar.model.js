const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
    name: String,
    submenu: [
        {
            name: String,
            link: String,
            number: String
        }
    ],
    link: String,
    total: Number
})


const navbarModel = mongoose.model('navbar', Schema)

module.exports = navbarModel