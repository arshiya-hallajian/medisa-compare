const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    handler : String,
    channel : String,
    mpns : [String],
    status : String,
    changeDate: String,
    title: String,
    serpRank: String,
    uom: String,
    p_p_uom: Number,
    unitPerSales: String,
    unitsPack: Number,
    packsCarton : Number,
    Medisa_url : String,
    Medisa_sku: {
        type : String,
        required : true,
    },
    Medisa_price : String,
    GST : String,
    company_name: String,
    company_brand : String,
    company_abbreviation : String,
    suppliers: [],
    competitors: [],

})


const csvSave = mongoose.model("csv", schema)

module.exports = csvSave