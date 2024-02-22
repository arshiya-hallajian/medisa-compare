
const fs = require("fs");
const {parse} = require("csv-parse");
const {saveToDatabase} = require("../../modules/pricingScrap.modules");




module.exports.csvController = async (req,res)=>{
    let io = req.app.get('socketIo')

    // io.on('mpns',async(mpnsData)=>{
    //     const mpns = mpnsData.array
    //     console.log(mpnsData.array)
    //     await saveToDatabase(mpns,io)
    // })


    const mpns = [];
    const fileName = req.file;

    fs.createReadStream(`./uploads/${fileName.filename}`)
        .pipe(parse({}))
        .on("data", async (row) => {
            mpns.push(row[0])
        })
        .on("end", async () => {
            console.log("finished");
            await saveToDatabase(mpns,io)
            // res.status(200).send(mpns)
            // fs.unlink(`./uploads/${fileName.filename}`,(err) => {
            //     if (err) {
            //       console.error(err);
            //       return;
            //     }
            //     console.log('File deleted successfully');
            //   });
        })
        .on("error", (e) => {
            console.log(e.message);
        });

}
