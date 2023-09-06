const axios = require("axios");


const findProductBySku = async (sku,Nprice,maxRetries = 4) => {

    try{

        const response = await axios.get( `${process.env.BIG_COMMERCE_API}/products?sku=${sku}`,{
            headers:{
                'Accept' : 'application/json',
                'Content-Type': 'application/json',
                'X-Auth-Token': `${process.env.AUTH_TOKEN}`
            }
        });


        const id = response.data.data[0].id
        const name = response.data.data[0].name;
        const type = response.data.data[0].type;
        const weight = response.data.data[0].weight;
        const salePrice = response.data.data[0].sale_price;

        let updateJson
        if(salePrice === 0 ){
            updateJson = {id,name,type,weight,price:Nprice}
        }else{
            updateJson = {id,name,type,weight,sale_price:Nprice}
        }

        // console.log(updateJson,"injam ok")



        return await updateProductById(updateJson)
    }catch(e){
        console.log("findProductBySku Error",`trying ${maxRetries}`)
        await new Promise(resolve => setTimeout(resolve, 6000));
        if(maxRetries > 0 ){
            return await findProductBySku(sku,Nprice, maxRetries -1)
        }
        console.log(e)
        return null
    }
}
module.exports = findProductBySku


const updateProductById = async (updateData, maxRetries = 4) => {
    console.log("🤯")
    try{
        return await axios.put(`${process.env.BIG_COMMERCE_API}/products/${updateData.id}`, updateData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Auth-Token': `${process.env.AUTH_TOKEN}`
            }
        })
    }catch(e){
        console.log("updateProductById Error",`trying ${maxRetries}`)
        await new Promise(resolve => setTimeout(resolve, 3000));
        if(maxRetries > 0 ){
            return await updateProductById(updateData, maxRetries -1)
        }
        return null
    }
}


module.exports = updateProductById