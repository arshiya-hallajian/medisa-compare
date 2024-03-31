const fs = require("fs");
const {Parser} = require("json2csv")
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
            query = {mpn_mpns: {$in: [search]}};
        } else if (type === "brand") {
            query = {
                $or: [
                    {medisa_title: new RegExp(search, "i")}, // Case-insensitive search in medisa_title
                    {company_brand: new RegExp(search, "i")} // Case-insensitive search in company_brand
                ]
            };
        } else {
            return res.status(400).send("Invalid search type");
        }

        const dbSearch = await csvSave.find(query);

        if (dbSearch.length === 0) {
            return res.status(404).send("No products found matching the search criteria");
        }

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(dbSearch)


        res.header('Content-Type', 'text/csv');
        res.attachment('search_result.csv');

        res.status(200).send(dbSearch);
    } catch (e) {
        console.log(e.message)
        return res.status(500).send(e.message)
    }
}


module.exports.csvSaveUpdate = async (req, res) => {
    if (req.body.searchType && req.body.skus) {
        const types = req.body.searchType;
        const skus = req.body.skus;

        console.log("input:", types, skus);
        try {
            for (const sku of skus) {

                const db_search = await csvSave.findOne({medisa_sku: sku});
                // console.log(db_search)

                const isBoxProduct = diagnoseProductSkuType(sku)
                console.log(isBoxProduct)
                for (const mpn of db_search.mpn_mpns) {
                    if (mpn) {
                        // console.log(mpn)

                        if (types.some(type => type === "Medisa")) {
                            const medisaResult = await medisaSearchByMpn(mpn);
                            // console.log(medisaResult.length)
                            for (const eachmedisa of medisaResult) {
                                console.log(eachmedisa)
                                if (eachmedisa.type === "variant") {
                                    for (const priceObj of eachmedisa.price) {
                                        if (priceObj.sku === sku) {
                                            const stock = eachmedisa.stock !== 0 ? "yes" : "no";
                                            // console.log(priceObj)
                                            db_search['medisa_title'] = eachmedisa.name;
                                            db_search['medisa_stock'] = stock;
                                            db_search['medisa_price'] = priceObj.price[0].price;
                                        }
                                    }
                                } else if (eachmedisa.type === "normal") {
                                    const stock = eachmedisa.stock !== 0 ? "yes" : "no";
                                    db_search['medisa_title'] = eachmedisa.name;
                                    db_search['medisa_stock'] = stock;
                                    db_search['medisa_price'] = eachmedisa.prices[0].price;
                                }

                            }

                        }

                        if (types.some(type => type === "Independence")) {
                            const independent = await independence_search(mpn, db_search['medisa_title'])
                            if (independent && independent.length > 0) {
                                const stock = independent[0].stock.available ? "yes" : "no";
                                db_search['ind_title'] = independent[0].title;
                                db_search['ind_url'] = independent[0].url;
                                db_search['ind_sku'] = mpn;
                                db_search['ind_stock'] = stock;
                                for (const eachPrice of independent[0].price) {
                                    // console.log("yfuycvajhvcasjsc")
                                    if (eachPrice.quantity.includes('1') && !isBoxProduct) {
                                        db_search['ind_uip'] = eachPrice.quantity
                                        db_search['ind_sellPrice'] = eachPrice.priceNumber
                                        // console.log("each")
                                    } else if (isBoxProduct && !eachPrice.quantity.includes('1')) {
                                        // console.log("box")
                                        db_search['ind_uip'] = eachPrice.quantity
                                        db_search['ind_sellPrice'] = eachPrice.priceNumber
                                    } else {
                                        console.log("none of them")
                                    }
                                }
                            } else {
                                console.log("no product")
                            }
                        }


                        if (types.some(type => type === "Teammed")) {
                            const teammedData = await teammed_search(mpn, db_search['medisa_title']);
                            if (teammedData && teammedData.length > 0) {
                                console.log(teammedData)
                                db_search['teammed_title'] = teammedData[0].title;
                                db_search['teammed_url'] = teammedData[0].url;
                                db_search['teammed_uip'] = teammedData[0].unitInPackaging;
                                db_search['teammed_stock'] = teammedData[0].stockStatus;
                                db_search['teammed_sellPrice'] = teammedData[0].price;
                            } else {
                                console.log("no product")
                            }
                        }


                        if (types.some(type => type === "BrightSky")) {
                            const brightSky = await brightSky_Search(mpn, db_search['medisa_title']);
                            if (brightSky && brightSky.length > 0) {
                                // console.log(brightSky)
                                if (!isBoxProduct && brightSky[0].unitInPackaging === "each") {
                                    console.log("each")
                                    db_search['brightSky_title'] = brightSky[0].title;
                                    db_search['brightSky_url'] = brightSky[0].url;
                                    db_search['brightSky_uip'] = brightSky[0].unitInPackaging;
                                    db_search['brightSky_stock'] = brightSky[0].stockStatus;
                                    db_search['brightSky_price'] = brightSky[0].price;
                                } else if (isBoxProduct && brightSky[0].unitInPackaging !== "each") {
                                    console.log("box")

                                    db_search['brightSky_title'] = brightSky[0].title;
                                    db_search['brightSky_url'] = brightSky[0].url;
                                    db_search['brightSky_uip'] = brightSky[0].unitInPackaging;
                                    db_search['brightSky_stock'] = brightSky[0].stockStatus;
                                    db_search['brightSky_price'] = brightSky[0].price;
                                } else {
                                    console.log("none of them")
                                }

                            } else {
                                console.log("no product")
                            }
                        }


                        if (types.some(type => type === "JoyaMedical")) {
                            const joyaMedical = await joyaMedical_search(mpn, db_search['medisa_title'])
                            if (joyaMedical && joyaMedical.length > 0) {
                                db_search['joya_title'] = joyaMedical[0].title;
                                db_search['joya_url'] = joyaMedical[0].link;
                                if (!isBoxProduct && joyaMedical[0].eachPrice) {
                                    console.log("each")
                                    db_search['joya_uip'] = joyaMedical[0].eachPrice.unit;
                                    db_search['joya_stock'] = "yes";
                                    db_search['joya_price'] = joyaMedical[0].eachPrice.exGst;
                                } else if (isBoxProduct && joyaMedical[0].boxPrice) {
                                    console.log("box")
                                    db_search['joya_uip'] = joyaMedical[0].boxPrice.unit;
                                    db_search['joya_stock'] = "yes";
                                    db_search['joya_price'] = joyaMedical[0].boxPrice.exGst;
                                }
                            } else {
                                console.log("no product")
                            }
                        }

                        // if (types.some(type => type === "AlphaMedical")) {
                        //
                        // }

                        if (types.some(type => type === "Medshop")) {
                            const medShop = await medShop_search(mpn, db_search['medisa_title'])
                            if (medShop && medShop.length > 0) {
                                console.log(medShop)
                                db_search['medshop_title'] = medShop[0].title;
                                db_search['medshop_url'] = medShop[0].url;
                                db_search['medshop_uip'] = medShop[0].unitInPackaging;
                                db_search['medshop_stock'] = medShop[0].stocks;
                                if (!isBoxProduct && medShop[0].unitInPackaging.includes('each')) {
                                    db_search['medshop_price'] = medShop[0].price;
                                } else if (isBoxProduct && !medShop[0].unitInPackaging.includes('each')) {
                                    db_search['medshop_price'] = medShop[0].price;
                                }
                            } else {
                                console.log("no product")
                            }
                        }


                    }
                }
            }

            res.send("ok")
        } catch (e) {
            res.status(400).send("error in csvSaveUpdate");
        }

    } else {
        res.status(400).send("invalid posts");
    }
}

const diagnoseProductSkuType = (sku) => {
    const trimmedSku = sku.replace(/_\w$/, "");

    const lastCharacter = trimmedSku.slice(-1);
    const isEachProduct = lastCharacter === '1';

    return !isEachProduct

}


module.exports.csvSaver = async (req, res) => {
    // let io = req.app.get('socketIo');

    const data = await ReadCsv(req.file);

    const fixedData = await DataFixer(data);

    try {
        for (const row of fixedData) {

            let checkExisting = null
            if (row.medisa_sku) {
                checkExisting = await csvSave.findOne({medisa_sku: row.medisa_sku});
            }


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
