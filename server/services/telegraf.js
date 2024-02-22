const {Telegraf} = require('telegraf')
// const {message} = require('telegraf/filters')


// 6825843830:AAHKDLzyIi7geGmQHrIIk0FBe_60l-A1oSw


        const bot = new Telegraf("6825843830:AAHKDLzyIi7geGmQHrIIk0FBe_60l-A1oSw")
        // console.log(bot)
        //
        // bot.telegram.setWebhook('https://73cb-151-246-154-159.ngrok-free.app/api/extract/').then(r => );
        // bot.use(async (ctx) => {
        //     console.log(await ctx,"ctx")
        //     await ctx.telegram.sendMessage("5007806275", "test")
        // })

const setupWebhook = async () =>{

    try {
        // await bot.telegram.setWebhook('https://65.109.177.4:443/api/extract/');
        await bot.telegram.setWebhook('https://65.109.177.4:443/mytelreport');
        console.log('Webhook set up successfully');
    } catch (error) {
        console.error('Error setting up webhook:');
    }
}

// Call the async function to set up the webhook
setupWebhook();

module.exports = bot;

