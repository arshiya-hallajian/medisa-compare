const fs = require("fs");
const {parse} = require("csv-parse");
const csvSave = require("../models/csvSave.model");
const axios = require("axios");
const cheerio = require("cheerio");


module.exports.csvDatabaseRead = async(req, res) => {
    try{
        const search = req.query.s
        if (!search){
            return res.status(500).send("invalid search")
        }
        const dbSearch = await csvSave.find({Medisa_sku: new RegExp(search)})
        if (!dbSearch){
            return res.status(404).send("not found")
        }
        res.status(200).send(dbSearch)
    }catch (e) {
        console.log(e.message)
        return res.status(500).send(e.message)
    }
}

module.exports.csvSaver = async (req, res) => {
    let io = req.app.get('socketIo');

    const data = await ReadCsv(req.file)

    const fixedData = await DataFixer(data)

    for (const row of fixedData) {
        try{
            const checkExisting = await csvSave.findOne({Medisa_sku: row.Medisa_sku})

            if(!checkExisting){
                await csvSave.create(row)
                console.log("new data created : " , row)
            }else{
                await csvSave.updateOne({Medisa_sku: row.Medisa_sku},row)
            }

        }catch (e) {
            console.log(e.message, "error in db save")
            res.status(500).send(e.message)
        }
    }
    res.status(200).send(fixedData)
}


const DataFixer = (data) => {
    return new Promise(resolve => {
        const fullData = []


        data.slice(2).map((row)=> {

            row.forEach((s,ind)=> {
                if(s === ''){
                    row[ind] = null
                }
            })

            //mpn section
            const handler = row[0];
            const channel = row[1];
            const mpns = [row[2], row[3], row[4]];
            const status = row[5];
            const changeDate = row[6];
            const title = row[7];
            const serpRank = row[8];
            //separated
            const uom = row[9];
            const p_p_uom = row[10]
            const unitPerSales = row[11];
            const unitsPack = row[12];
            const packsCarton = row[13];
            //medisa listing
            const Medisa_url = row[15];
            const Medisa_sku = row[16];
            const Medisa_price = row[17];
            //
            const GST = row[18];
            // company info
            const company_name = row[19];
            const company_brand = row[20];
            const company_abbreviation = row[21];

            const suppliers = null;
            const competitors = null;

            fullData.push({
                handler,
                channel,
                mpns,
                status,
                changeDate,
                title,
                serpRank,
                uom,
                p_p_uom,
                unitPerSales,
                unitsPack,
                packsCarton,
                Medisa_url,
                Medisa_sku,
                Medisa_price,
                GST,
                company_name,
                company_brand,
                company_abbreviation,
                suppliers,
                competitors
            })
        })
        resolve(fullData)
    })
}




const ReadCsv = (fileName) => {
    return new Promise((resolve, reject) => {
        const data = []

        const readStream = fs.createReadStream(`./uploads/${fileName.filename}`)

        readStream.pipe(parse({})).on('data', async (row) => {
            data.push(row)
        })

        readStream.on('end', () => {
            console.log("ended reading csv")

            fs.unlink(`./uploads/${fileName.filename}`, (err) => {
                if (err) {
                    console.error(err.message);
                }
                console.log('File deleted successfully');
            });
            resolve(data)
        })

        readStream.on('error', (err) => {
            console.log(err.message)
            reject(null);
        })
    })
}