
const fs = require("fs");
const {parse} = require("csv-parse");


module.exports.csvController = async (req,res)=>{
    const mpns = [];
    const fileName = req.file;

    fs.createReadStream(`./uploads/${fileName.filename}`)
        .pipe(parse({}))
        .on("data", async (row) => {
            mpns.push(row[0])
        })
        .on("end", async () => {
            console.log("finished");
            res.status(200).send(mpns)
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
