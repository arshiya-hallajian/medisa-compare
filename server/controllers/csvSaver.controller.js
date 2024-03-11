const fs = require("fs");
const {parse} = require("csv-parse");
const csvSave = require("../models/csvSave.model");
const axios = require("axios");
const cheerio = require("cheerio");
const {medisaSearchByMpn} = require("../modules/productScrap.modules");
const {teammed_search} = require("../modules/csv_save/teammed");
const {brightSky_Search} = require("../modules/csv_save/brightSky");
const {joyaMedical_search} = require("../modules/csv_save/joyaMedical");
const {medShop_search} = require("../modules/csv_save/medShop");
const {independence_search} = require("../modules/csv_save/independence");


module.exports.csvDatabaseRead = async (req, res) => {
    try {

        const type = req.query.type;
        const search = req.query.s;

        if (!search || !type) {
            return res.status(400).send("Invalid search query");
        }

        let query;
        if (type === "mpn") {
            query = { mpn_mpns: { $in: [search] } };
        } else if (type === "brand") {
            query = {
                $or: [
                    { medisa_title: new RegExp(search, "i") }, // Case-insensitive search in medisa_title
                    { company_brand: new RegExp(search, "i") } // Case-insensitive search in company_brand
                ]
            };
        } else {
            return res.status(400).send("Invalid search type");
        }

        const dbSearch = await csvSave.find(query);

        if (dbSearch.length === 0) {
            return res.status(404).send("No products found matching the search criteria");
        }

        res.status(200).send(dbSearch);
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

            const checkExisting = await csvSave.findOne({medisa_sku: row.medisa_sku});


            // for (const mpn of row.mpn_mpns) {
            //     if (mpn) {
            //         const medisaResult = await medisaSearchByMpn(mpn);
            //         if (medisaResult.length > 0) {
            //             row.medisa = medisaResult;
            //
            //
            //             const independent = await independence_search(mpn, medisaResult[0].name)
            //             if (independent) row.independence = independent;
            //
            //             const medShop = await medShop_search(mpn,medisaResult[0].name)
            //             if(medShop) row.medshop = medShop
            //
            //             const joyaMedical = await joyaMedical_search(mpn, medisaResult[0].name)
            //             if (joyaMedical) row.joyaMedical = joyaMedical;
            //             const brightSky = await brightSky_Search(mpn, medisaResult[0].name);
            //             if(brightSky) row.brightSky = brightSky
            //             const teammedData = await teammed_search(mpn, medisaResult[0].name);
            //             if(teammedData) row.teammed = teammedData
            //
            //         }
            //     }
            // }

            console.log("--------------------------------")


            if (!checkExisting) {
                await csvSave.create(row)
                console.log("new data created : ", row)
            } else {
                await csvSave.updateOne({medisa_sku: row.medisa_sku}, row)
            }
        }
        // console.log(fixedData)
        res.status(200).send(fixedData)
    } catch (e) {
        console.log("error in db save :", e.message)
    }
}


const DataFixer = (data) => {
    return new Promise(resolve => {
        const fullData = [];


        data.slice(2).map((row) => {

            row.forEach((s, ind) => {
                if (s === '') {
                    row[ind] = null
                }
            })

            //mpn section
            const mpn_channel = row[0];
            const mpn_mpns = [row[1], row[2], row[3]];
            const mpn_status = row[4];
            const mpn_changeDate = row[5];
            const mpn_gst = row[6];
            const mpn_image = row[7];
            // company info
            const company_uom = row[8];
            const company_unitsPack = row[9];
            const company_packsCarton = row[10];
            const company_name = row[11];
            const company_brand = row[12];
            const company_abbreviation = row[13];
            //medisa
            const medisa_title = row[14]
            const medisa_url = row[15]
            const medisa_serpRank = row[16]
            const medisa_sku = row[17]
            const medisa_unitInPackaging = row[18]
            const medisa_stock = row[19]
            const medisa_price = row[20]

            //indipendence
            const ind_title = row[21];
            const ind_url = row[22];
            const ind_sku = row[23];
            const ind_uip = row[24];
            const ind_stock = row[25];
            const ind_sellPrice = row[26];
            const ind_buyPrice = row[27];
            //teammed
            const teammed_title = row[28];
            const teammed_url = row[29];
            const teammed_uip = row[30];
            const teammed_stock = row[31];
            const teammed_sellPrice = row[32];
            const teammed_buyPrice = row[33];
            // main
            const main_title = row[34];
            const main_url = row[35];
            const main_uip = row[36];
            const main_stock = row[37];
            const main_sellPrice = row[38];
            const main_buyPrice = row[39];
            //bright sky
            const brightSky_title = row[40];
            const brightSky_url = row[41];
            const brightSky_stock = row[42];
            const brightSky_uip = row[43];
            const brightSky_price = row[44];
            //joya medical
            const joya_title = row[45];
            const joya_url = row[46];
            const joya_stock = row[47];
            const joya_uip = row[48];
            const joya_price = row[49];
            //alpha medical
            const alpha_title = row[50];
            const alpha_url = row[51];
            const alpha_stock = row[52];
            const alpha_uip = row[53];
            const alpha_price = row[54];
            //med shop
            const medShop_title = row[55];
            const medShop_url = row[56];
            const medShop_stock = row[57];
            const medShop_uip = row[58];
            const medShop_price = row[59];


            fullData.push({
                mpn_channel,
                mpn_mpns,
                mpn_status,
                mpn_changeDate,
                mpn_gst,
                mpn_image,
                company_uom,
                company_unitsPack,
                company_packsCarton,
                company_name,
                company_brand,
                company_abbreviation,
                medisa_title,
                medisa_url,
                medisa_serpRank,
                medisa_sku,
                medisa_unitInPackaging,
                medisa_stock,
                medisa_price,
                ind_title,
                ind_url,
                ind_sku,
                ind_uip,
                ind_stock,
                ind_sellPrice,
                ind_buyPrice,
                teammed_title,
                teammed_url,
                teammed_uip,
                teammed_stock,
                teammed_sellPrice,
                teammed_buyPrice,
                main_title,
                main_url,
                main_uip,
                main_stock,
                main_sellPrice,
                main_buyPrice,
                brightSky_title,
                brightSky_url,
                brightSky_stock,
                brightSky_uip,
                brightSky_price,
                joya_title,
                joya_url,
                joya_stock,
                joya_uip,
                joya_price,
                alpha_title,
                alpha_url,
                alpha_stock,
                alpha_uip,
                alpha_price,
                medShop_title,
                medShop_url,
                medShop_stock,
                medShop_uip,
                medShop_price
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
