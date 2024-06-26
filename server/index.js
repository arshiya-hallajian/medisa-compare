require('dotenv').config();
const axios = require('axios');
axios.defaults.timeout = 70000;
const express = require('express');
const cors = require("cors");
const http = require('http');
const {Server} = require('socket.io');
const mongoose = require("mongoose");
const bot = require('./services/telegraf');



const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        // origin: "http://65.109.177.4:443"
        // origin: "http://localhost:5174"
        origin: "*"
    }
})

app.use(cors({
    // origin: `http://65.109.177.4:443`,
    // origin: `http://localhost:5174`,
    origin: `*`,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.set('socketIo',io)
app.use(bot.webhookCallback("/mytelreport"))

//import routers
const pricing_route = require('./routes/pricing.route')
const extract_route = require('./routes/extract.route')
const csvSave_route = require('./routes/csvSave.route')
// const dailyReport = require("./services/dailyReport");


mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(( error) => {
        console.error('error in mongodb connection:', error);
    });



io.on('connection',(Socket) =>{
    console.log("socket connected")
    Socket.on('disconnect',()=>{
        console.log("socket disconnected")
    })

})


app.get('/', (req,res) => {
    res.status(200).send("test")
})

app.use('/api/pricing', pricing_route)
app.use('/api/extract', extract_route)
app.use('/api/csvSave', csvSave_route)



server.listen(process.env.PORT, ()=>{
    console.log(`server is running on ${process.env.PORT}`)

});


// dailyReport()