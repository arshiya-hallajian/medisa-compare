const axios = require("axios");


const find_medisa_by_id = async (id) => {
    if (id) {
        try {
            const res = await axios.get(`${process.env.BIG_COMMERCE_API}/products/${id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Auth-Token': `${process.env.AUTH_TOKEN}`
                }
            })


            return res.data.data
        } catch (e) {
            console.log(e,'find by id medisa Api error')
            return null
        }
    } else {
        console.log('no id')
        return null
    }
}


const update_medisa_normal = async (id, data) => {
    if (id && data) {
        try {
            const res = await axios.put(`${process.env.BIG_COMMERCE_API}/products/${id}`,data, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Auth-Token': `${process.env.AUTH_TOKEN}`
                }
            })

            return res.data.data
        } catch (e) {
            console.log(e,'update normal error error')
            return null
        }
    } else {
        console.log('no id and var_id')
        return null
    }
}

const update_medisa_variant = async (id,var_id,data) => {
    if (id && var_id && data) {
        try {
            const res = await axios.put(`${process.env.BIG_COMMERCE_API}/products/${id}/variants/${var_id}`,data, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-Auth-Token': `${process.env.AUTH_TOKEN}`
                }
            })

            return res.data.data
        } catch (e) {
            console.log(e,'update variant error error')
            return null
        }
    } else {
        console.log('no id and var_id')
        return null
    }
}




module.exports = {find_medisa_by_id,update_medisa_variant, update_medisa_normal}