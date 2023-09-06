
const {findProductBySku} = require("../modules/pricing.modules")


module.exports.updateProductController = async (req,res) => {
    const price = req.query.price;
    const sku = req.params['sku'];
    console.log(price,sku,"node-log")
    const resp = await findProductBySku(sku,price)
    if(resp == null){
        return res.status(500).send({
            status: false,
            data: "error finding by sku"
        })
    }else{

        res.status(200).json({
            status:true,
            data:resp.data
        });
    }

}



module.exports.updateBatchProductController = async (req,res) => {
    const ans = []
    try{
        console.log(req.body)
        for(const product of req.body){
            const sku = product.sku;
            const price = product.price;
            console.log(price,sku,"node-log")
            const resp = await findProductBySku(sku,price)
            if(resp === null){
                ans.push("false")
            }else{
                ans.push("true")
            }
        }
        return res.status(200).send({
            status:true,
            data:ans
        });
    }catch(e){
        res.status(400).send({
            status:false,
            data:"error happened"
        });
    }
}



