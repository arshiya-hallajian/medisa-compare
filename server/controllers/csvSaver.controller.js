const fs = require("fs");
const {parse} = require("csv-parse");
const csvSave = require("../models/csvSave.model");
const axios = require("axios");
const cheerio = require("cheerio");
const {medisaSearchByMpn} = require("../modules/productScrap.modules");
const {teammed_search} = require("../modules/csv_save/teammed");


module.exports.csvDatabaseRead = async (req, res) => {
    try {
        const search = req.query.s
        if (!search) {
            return res.status(500).send("invalid search")
        }
        const dbSearch = await csvSave.find({Medisa_sku: new RegExp(search)})
        if (!dbSearch) {
            return res.status(404).send("not found");
        }
        res.status(200).send(dbSearch)
    } catch (e) {
        console.log(e.message)
        return res.status(500).send(e.message)
    }
}


module.exports.csvSaver = async (req, res) => {
    // let io = req.app.get('socketIo');

    const data = await ReadCsv(req.file);

    const fixedData = await DataFixer(data);

    try {
        for (const row of fixedData) {
            // const checkExisting = await csvSave.findOne({Medisa_sku: row.Medisa_sku});
            row.medisa = [];


            for (const mpn of row.mpns) {
                if (mpn) {
                    const medisaResult = (await medisaSearchByMpn(mpn, row.title.split(' ')[0]));
                    // console.log("kir",medisaResult)
                    if (medisaResult.length > 0) {
                        row.medisa.push(medisaResult)
                        const teammedData = await teammed_search(mpn, medisaResult[1].name);
                        if(teammedData) row.teammed = teammedData
                    }
                }
            }

            // if(!checkExisting){
            //     await csvSave.create(row)
            //     console.log("new data created : " , row)
            // }else{
            //     await csvSave.updateOne({Medisa_sku: row.sku},row)
            // }
        }
        // console.log(fixedData)
        res.status(200).send(fixedData)
    } catch (e) {
        console.log(e.message, "error in db save")
    }
}


const DataFixer = (data) => {
    return new Promise(resolve => {
        const fullData = []


        data.slice(2).map((row) => {

            row.forEach((s, ind) => {
                if (s === '') {
                    row[ind] = null
                }
            })

            //mpn section
            const channel = row[0];
            const mpns = [row[1], row[2], row[3]];
            const status = row[4];
            const changeDate = row[5];
            const gst = row[6];
            const image = row[7];
            //separated
            const uom = row[8];
            const unitsPack = row[9];
            const packsCarton = row[10];
            //
            // company info
            const company_name = row[11];
            const company_brand = row[12];
            const company_abbreviation = row[13];
            const title = row[14]
            const Medisa_url = row[15]
            const serpRank = row[16]
            const sku = row[17]
            const unitInPackaging = row[18]
            const stock = row[19]
            const price = row[20]

            const suppliers = null;
            const competitors = null;

            fullData.push({
                channel,
                mpns,
                status,
                changeDate,
                title,
                image,
                gst,
                uom,
                Medisa_url,
                serpRank,
                sku,
                unitInPackaging,
                stock,
                price,
                unitsPack,
                packsCarton,
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
