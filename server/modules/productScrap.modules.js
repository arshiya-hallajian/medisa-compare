const axios = require("axios");
const cheerio = require("cheerio");

const checkMedisa = async(sku) => {
    try {
        const response = await axios.get( `${process.env.BIG_COMMERCE_API}/products?sku=${sku}`,{
            headers:{
                'Accept' : 'application/json',
                'Content-Type': 'application/json',
                'X-Auth-Token': `${process.env.AUTH_TOKEN}`
            }
        });

        return response.data.meta.pagination.count
    }catch (e) {
        console.log('check medisa F error')
    }
}
const page_link_scrap = async(url,io) => {
    try{
        let currentPage = 1
        const maxPage = 100
        const link_array = []

        while(currentPage < maxPage){

            const resp = await axios.get(`${url}?p=${currentPage}`,{
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
                price=[]
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


                const title = main_div.find('h1.page-title > span').text()
                const sku = main_div.find('div.product-info-main div.sku.product div.value').text()
                const describtion = main_div.find('div.description.product div.value').text()



                const check = await checkMedisa(sku)

                const total = {
                    name: title,
                    link: product_link,
                    specs: specs,
                    sku: sku,
                    desc: describtion,
                    stock: stock_list,
                    price: price,
                    exist: check
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


module.exports = {productScrape}