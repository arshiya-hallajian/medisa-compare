
const mongoose = require("mongoose")

const Schema = new mongoose.Schema(
  {
    mpn : {
        type:String
    },
    Name : {
        type: String
    },
    Dprice : [],
    Cprice : []
  },
  { timestamps: true },
);

const Product = mongoose.model('Product', Schema);

module.exports = Product;