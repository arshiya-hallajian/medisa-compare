const axios = require("axios");
const {findVariantById} = require("./productScrap.modules");


const MedisaSearchByMpn = async (mpn, maxRetries = 3) => {
    try {

        const res = await axios.get(`${process.env.BIG_COMMERCE_API}/products?keyword=${mpn}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Auth-Token': `${process.env.AUTH_TOKEN}`
            }
        })
        return res.data.data
    } catch (e) {
        console.log("error in medisa search mpn in search api")
        await new Promise(resolve => setTimeout(resolve, 3000));
        if (maxRetries > 0) {
            return await MedisaSearchByMpn(mpn, maxRetries - 1)
        }
        return null
    }
}


const MedisaApi_GetAllDataFromProduct = async (mpn, firstname) => {
    const medisaSearchResult = await MedisaSearchByMpn(mpn)

    let data = []


    if (medisaSearchResult.length === 0 && medisaSearchResult.length > 5 && !medisaSearchResult) {
        console.log('not exist')
        return null
    } else if (medisaSearchResult.length > 0) {
        console.log('found ', medisaSearchResult.length)
        console.log('found ', firstname)
        for (let x of medisaSearchResult) {
            if (x['name'].includes(firstname)) {
                const medisaStock = x['inventory_level'] !== 0 ;
                if (x['option_set_id'] == null) {
                    // console.log("type null")
                    data.push({
                        type: 'normal',
                        id: x['id'],
                        name: x['name'],
                        mpn: mpn,
                        inventory: medisaStock,
                        sku: x['sku'],
                        prices: {
                            price: x['price'],
                            retail_price: x['retail_price'],
                            sale_price: x['sale_price'],
                            calc_price: x['calculated_price']
                        }
                    })
                } else {
                    // console.log('type variant')
                    const variants = await findVariantById(x['id'], mpn)

                    let price = []
                    for (let y of variants) {
                        const options = y['option_values']
                        // console.log(option)
                        // console.log(option.length)
                        if (options.length > 0) {
                            let label = ''
                            for (let option of options) {
                                label += " " + option.label
                            }
                            price.push({
                                image: y['image_url'],
                                sku: y['sku'],
                                label: label,
                                prices: {
                                    price: y['price'],
                                    retail_price: y['retail_price'],
                                    sale_price: y['sale_price'],
                                    calc_price: y['calculated_price']
                                }
                            })
                        } else {
                            return null
                        }
                    }

                    console.log(price)
                    data.push({
                        type: 'variant',
                        id: x['id'],
                        name: x['name'],
                        mpn: mpn,
                        inventory: medisaStock,
                        sku: x['sku'],
                        variants: price,
                    })
                }
            }
        }
    }
    return data
}

module.exports = {MedisaApi_GetAllDataFromProduct,MedisaSearchByMpn}