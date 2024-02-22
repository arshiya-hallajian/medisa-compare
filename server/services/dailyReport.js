const cron = require('node-cron')
const {searchFunction} = require("../controllers/search.controller");

const dailyReport = () => {
    const searchThings = ['nutrini', 'fortisip'];
    for (let everySearch of searchThings) {
        searchFunction(everySearch,null,`🔥Daily Report of _${everySearch}_`)
    }
}

cron.schedule("0 0 * * *", () => {
    dailyReport()
})

module.exports = dailyReport;