const axios = require("axios");
const cheerio = require("cheerio");
const {MedisaApi_GetAllDataFromProduct} = require("../modules/search.Api.modules");
const {medisaEditor} = require("../modules/medisaFixer.modules");


const All_pages_link_scrap = async (search, io = null) => {
    try {
        let currentPage = 1
        const maxPage = 100
        const link_array = []

        while (currentPage < maxPage) {

            search = search.replace(" ", "+")
            const pageLink = `${process.env.COMP_URL}/catalogsearch/result/?q=${search}&p=${currentPage}`

            const resp = await axios.get(pageLink, {
                maxBodyLength: Infinity,
                timeout: 30000
            });

            if (io) {
                io.emit('search-loader', {
                    status: "link",
                    page: currentPage
                })
            }

            const $ = cheerio.load(resp.data);

            // scrap all products link of one page
            const product_link = $('div.products.wrapper.grid.products-grid > ol > li');
            product_link.each((index, elm) => {
                let products_link = $(elm).find('.product-item-name > .product-item-link').attr('href');
                link_array.push(products_link)
            })

            const next_btn = $('a.next.action')
            if (next_btn.length === 0) {
                break;
            }
            currentPage++
        }

        //returning whole links of all pages
        return link_array

    } catch (e) {
        console.log('page link scrap error', e.message)
    }
}

const one_page = async (url, maxRetries = 3) => {
    try {
        const res = await axios.get(url)
        return cheerio.load(res.data);
    } catch (e) {
        console.log("one_page function Error", `trying ${maxRetries}`)
        await new Promise(resolve => setTimeout(resolve, 3000));
        if (maxRetries > 0) {
            return await one_page(url, maxRetries - 1)
        }
        return null
    }
}


const searchFunction = async (search, io = null, title = null) => {
    const fData = []
    let count = 0;
    const PriceDifferenceCounter = []
    const StockCounter = []


    try {
        // console.log('here')
        const all_links = await All_pages_link_scrap(search, io)
        if (!all_links || all_links.length === 0) {
            console.log('no link in function')
            if(io) {
                io.emit('finished')
            }
            return null
        }


        console.log(all_links, "all links")
        for (const link of all_links) {


            const $ = await one_page(link)
            count += 1
            const main_div = $('div.column.main')
            const price = indPage_price_scrap($, main_div)
            const stocks = indPage_stock_scrap($)
            const specs = indPage_spec_scrap($, main_div)

            //scrap mpn
            const s_mpn = $('#maincontent > div.columns > div > div.product-info-main > div.product.attribute.overview > div').text().split(' ')
            const mpn = s_mpn[s_mpn.length - 1]
            //scrap title
            const title = main_div.find('h1.page-title > span').text()
            //scrap sku
            const sku = main_div.find('div.product-info-main div.sku.product div.value').text()
            //scrap description
            const description = main_div.find('div.description.product div.value').text()

            const medisaCheck = await MedisaApi_GetAllDataFromProduct(mpn, title.split(' ')[0])


            const total = {
                name: title,
                link: link,
                specs: specs,
                mpn: mpn,
                sku: sku,
                desc: description,
                stock: stocks,
                price: price,
                medisa: medisaCheck
            }
            // console.log(count)

            if(medisaCheck){
                const editMedisaCheck = await medisaEditor(total, PriceDifferenceCounter, StockCounter)
                fData.push(editMedisaCheck)
            }else{
                fData.push(total)
            }


            if (io) {
                io.emit('search-loader', {
                    status: "loading",
                    number: count,
                    total: all_links.length,
                    data: fData
                })
            }

        }

        if (io) {
            io.emit('finished')
        }

        if(title){
            await axios.post("http://65.109.177.4:2202/api/extract/sendReport", {
                price: PriceDifferenceCounter,
                stock: StockCounter,
                title: title
            })
        }
        // console.log(fData)
        return fData
    } catch (e) {
        console.log(e.message, 'error in ind search')
        return null
    }
}

const searchController = async (req, res) => {

    const search = req.query.search
    const io = req.app.get('socketIo')


    res.status(200).send("ok")
    console.log(search, "search")
    if (search && search !== '') {
        searchFunction(search, io,`🔍Your Search Report of _${search}_:`)
    }
}



const indPage_spec_scrap = ($, main_div) => {
    const specs = []
    const specific = main_div.find('#product-attribute-specs-table tr')
    specific.each((i, elm) => {
        const title = $(elm).find('th').text()
        const value = $(elm).find('td').text()
        const temp = {
            name: title,
            value: value
        }
        specs.push(temp)
    })
    return specs
}

const indPage_stock_scrap = ($) => {
    const stock_section = $('#maincontent > div.columns > div > div.product-info-main > div.stock-info-holder > div.product-store-availability')
    let stock_list = []
    stock_section.each((i, elm) => {
        const stock_find = $(elm).find('script:eq(0)').text().trim()
        const json = JSON.parse(stock_find)
        const stock_array = json["*"]["Magento_Ui/js/core/app"]['components']['catalog-product-retailer-availability']['storeOffers']

        stock_array.forEach((stock) => {
            const temp = {
                name: stock.name,
                available: stock.isAvailable,
                quantity: stock.stockQuantity
            }
            stock_list.push(temp)
        })
    })
    return stock_list
}

const indPage_price_scrap = ($, main_div) => {
    const price_form = main_div.find('div.product-add-form form')

    let price = []
    price_form.each((i, elm) => {
        const P_title = $(elm).find('div.packet-title > strong').text().trim()
        const P_quantity = $(elm).find('div.packet-title > div').text().trim()
        const P_priceNumber = $(elm).find('div.packet-price span.price').text()
        const C_title = $(elm).find('div.carton-title > strong').text().trim()
        const C_quantity = $(elm).find('div.carton-title > div').text().trim()
        const C_priceNumber = $(elm).find('div.carton-price span.price').text()

        let temp_price;
        if (P_title !== '') {
            temp_price = {
                title: P_title,
                quantity: P_quantity,
                priceNumber: P_priceNumber
            }
            price.push(temp_price)
        } else {
            temp_price = {
                title: C_title,
                quantity: C_quantity,
                priceNumber: C_priceNumber
            }
            price.push(temp_price)
        }
    })
    return price
}

module.exports = {searchFunction,searchController, one_page, indPage_stock_scrap, indPage_spec_scrap, indPage_price_scrap, All_pages_link_scrap}
