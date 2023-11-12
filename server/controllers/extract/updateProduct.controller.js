const {update_medisa_variant, update_medisa_normal} = require("../../modules/medisaApi.modules");
const {findVariantById} = require("../../modules/productScrap.modules");


module.exports.updateProductController = async (req, res) => {
    if (req.body.type === 'normal') {
        try {
            const updateObject = {
                name: req.body.name,
                sku: req.body.sku,
                price: req.body.price,
                cost_price: req.body.cost_price,
                sale_price: req.body.sale_price,
                mpn: req.body.mpn,
            }
            await update_medisa_normal(req.body.id, updateObject)
            res.status(200).send("ok")
        } catch (e) {
            res.status(400).send(e)
        }
    } else if (req.body.type === 'variant') {
        try {
            const variants = await findVariantById(req.body.id, req.body['D_mpn'])
            const updateObj = {
                name: req.body.name,
                sku: req.body.sku,
                npm: req.body.npm,
            }
            await update_medisa_normal(req.body.id, updateObj)
            if (req.body.each && variants.length > 0) {
                const each = req.body.each
                const each_id = variants[0].id
                const updateObj = {
                    price: each.price,
                    cost_price: each.cost_price,
                    sale_price: each.sale_price,
                }
                await update_medisa_variant(req.body.id, each_id, updateObj)
                if (req.body.box && variants.length > 1) {
                    const box = req.body.box
                    const box_id = variants[1].id
                    const updateObj = {
                        price: box.price,
                        cost_price: box.cost_price,
                        sale_price: box.sale_price,
                    }
                    await update_medisa_variant(req.body.id, box_id, updateObj)
                }
            }
            res.status(200).send("ok")
        } catch (e) {
            res.status(400)
            console.log(e.message)
        }

    }
}