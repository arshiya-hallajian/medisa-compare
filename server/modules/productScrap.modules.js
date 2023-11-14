const axios = require("axios");
const cheerio = require("cheerio");

const findVariantById = async(id, mpn,maxRetries=3) => {
    try{
        const res = await axios.get(`${process.env.BIG_COMMERCE_API}/products/${id}/variants`,{
            headers:{
                'Accept' : 'application/json',
                'Content-Type': 'application/json',
                'X-Auth-Token': `${process.env.AUTH_TOKEN}`
            }
        })
        const result = res.data.data

        const data = []
        for(let x of result){
            const extractMPn = x.sku.split('_')
            if(extractMPn[1] === mpn){
                data.push(x)
            }
        }
        return data
    }catch(e){
        console.log(e, 'find variant by id func error')
        await new Promise(resolve => setTimeout(resolve,3000))
        if (maxRetries > 0) {
            return await findVariantById(id, mpn, maxRetries - 1)
        }
        return null
    }
}


const medisaSearchByMpn = async(mpn,firstname) => {
    try{
        // console.log(mpn)
        const res = await axios.get(`${process.env.BIG_COMMERCE_API}/products?keyword=${mpn}`,{
            headers:{
                'Accept' : 'application/json',
                'Content-Type': 'application/json',
                'X-Auth-Token': `${process.env.AUTH_TOKEN}`
            }
        })
        

        let data = []
        let tmp = {}
        const result = res.data.data

        console.log('length',result.length)

        if(result.length === 0 && result.length > 5){
            console.log('not exist')
            return null
        }else if(result.length > 0){
            console.log('found ', result.length)
            console.log('found ', firstname)
            for(let x of result){
                if(x['name'].includes(firstname)) {
                    if (x['option_set_id'] == null) {
                        // console.log("type null")
                        tmp = {
                            type: 'normal',
                            id: x['id'],
                            name: x['name'],
                            mpn: mpn,
                            sku: x['sku'],
                            prices: [{label: 'price', price: x['price']}, {
                                label: 'cost_price',
                                price: x['cost_price']
                            }, {label: 'sale_price', price: x['sale_price']}, {
                                label: 'calc_price',
                                price: x['calculated_price']
                            }],
                        }
                        data.push(tmp)
                    } else {
                        // console.log('type variant')
                        const vari = await findVariantById(x['id'], mpn)

                        let price = []
                        for (let y of vari) {
                            const option = y['option_values']
                            // console.log(option)
                            // console.log(option.length)
                            if (option.length > 1) {
                                if (option[2] !== undefined) {
                                    price.push({
                                        image: y['image_url'],
                                        sku: y['sku'],
                                        label: [option[0]['label'], option[1]['label'], option[2]['label']],
                                        price: [{label: 'price', price: y['price']}, {
                                            label: 'cost_price',
                                            price: y['cost_price']
                                        }, {label: 'sale_price', price: y['sale_price']}, {
                                            label: 'calc_price',
                                            price: y['calculated_price']
                                        }]
                                    })
                                } else {
                                    price.push({
                                        image: y['image_url'],
                                        sku: y['sku'],
                                        label: [option[0]['label'], option[1]['label']],
                                        price: [{label: 'price', price: y['price']}, {
                                            label: 'cost_price',
                                            price: y['cost_price']
                                        }, {label: 'sale_price', price: y['sale_price']}, {
                                            label: 'calc_price',
                                            price: y['calculated_price']
                                        }]
                                    })
                                }
                            } else {
                                price.push({
                                    image: y['image_url'],
                                    sku: y['sku'],
                                    label: [option[0]],
                                    price: [{label: 'price', price: y['price']}, {
                                        label: 'cost_price',
                                        price: y['cost_price']
                                    }, {label: 'sale_price', price: y['sale_price']}, {
                                        label: 'calc_price',
                                        price: y['calculated_price']
                                    }]
                                })
                            }
                        }
                        console.log(price)
                        tmp = {
                            type: 'variant',
                            id: x['id'],
                            name: x['name'],
                            mpn: mpn,
                            sku: x['sku'],
                            price: price,
                        }
                        data.push(tmp)
                    }
                }
            }
        }
        return data
    }catch(e){
        console.log(e.message, 'medisaSearchByApi error')
    }
}

const page_link_scrap = async(url,io) => {
    try{
        let currentPage = 1
        const maxPage = 100
        const link_array = []

        while(currentPage < maxPage){

            const ttt = `${url}?p=${currentPage}`
            console.log(ttt)
            const resp = await axios.get(ttt,{
                maxBodyLength: Infinity,
                timeout: 30000
            });
            console.log(currentPage)
            io.emit('extract-loader',{
                status: "link",
                page: currentPage
            })
            const $ = cheerio.load(resp.data);


            // scrap all products link of one page
            const product_link = $('#maincontent > div.columns > div.column.main > div.products.wrapper.grid.products-grid > ol > li');
            product_link.each((index,elm)=>{
                let product_link = $(elm).find('.product-item-name > .product-item-link').attr('href');
                link_array.push(product_link)
            })

            const next_btn = $('a.next.action')
            if(next_btn.length === 0){
                break;
            }
            currentPage++
        }
        // console.log(link_array, "+", link_array.length)

        return link_array

    }catch(e){
        console.log('page link scrap error',e.message)
    }
}

const productScrape = async(url,io) => {
    if(url){

        try{
            const links = await page_link_scrap(url,io)
            // console.log(links.length)

            if(!links){
                console.log('no link in function')
                // throw new Error('no link')
                io.emit('finished')
                return
            }
            const fData = []
            let count = 0;

            for (const product_link of links) {
                const resp = await axios.get(product_link);
                const $ = cheerio.load(resp.data);
                const main_div = $('div.column.main')

                count += 1
                //scrap price
                const price_form = main_div.find('div.product-add-form form')
                let price=[]
                price_form.each((i,elm)=>{
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




                //scrap stock
                const stock_section = $('#maincontent > div.columns > div > div.product-info-main > div.stock-info-holder > div.product-store-availability')
                let stock_list = []
                stock_section.each((i,elm)=>{
                    const stock_find = $(elm).find('script:eq(0)').text().trim()
                    const json = JSON.parse(stock_find)
                    const stock_array = json["*"]["Magento_Ui/js/core/app"]['components']['catalog-product-retailer-availability']['storeOffers']
                    // console.log("**********first")
                    stock_array.forEach((stock)=>{
                        const temp = {
                            name : stock.name,
                            available: stock.isAvailable,
                            quantity: stock.stockQuantity
                        }
                        stock_list.push(temp)
                        // console.log(stock.name,"-",stock.isAvailable,":",stock.stockQuantity)
                    })
                    // console.log("*********end")
                })




                //scrap specs
                const specs = []
                const specefic = main_div.find('#product-attribute-specs-table tr')
                specefic.each((i,elm)=>{
                    const title = $(elm).find('th').text()
                    const value = $(elm).find('td').text()
                    const temp = {
                        name: title,
                        value: value
                    }
                    specs.push(temp)
                })


                const s_mpn = $('#maincontent > div.columns > div > div.product-info-main > div.product.attribute.overview > div').text().split(' ')
                const mpn = s_mpn[s_mpn.length-1]


                const title = main_div.find('h1.page-title > span').text()
                const sku = main_div.find('div.product-info-main div.sku.product div.value').text()
                const describtion = main_div.find('div.description.product div.value').text()



                const medisaCheck = await medisaSearchByMpn(mpn,title.split(' ')[0])

                const total = {
                    name: title,
                    link: product_link,
                    specs: specs,
                    mpn:mpn,
                    sku: sku,
                    desc: describtion,
                    stock: stock_list,
                    price: price,
                    medisa: medisaCheck
                }
                console.log(count)
                fData.push(total)



                io.emit('extract-loader',{
                    status: "loading",
                    number: count,
                    total: links.length,
                    data: fData
                })
            }
        }catch (e) {
            console.log(e, 'error in scrap')
        }
        io.emit('finished')
    }
}


module.exports = {productScrape,findVariantById}