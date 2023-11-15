const axios = require('axios');
axios.defaults.timeout = 10000;
const express = require('express');
const cors = require("cors");
const http = require('http');
const {Server} = require('socket.io');
const mongoose = require("mongoose");

require('dotenv').config();


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

//import routers
const pricing_route = require('./routes/pricing.route')
const extract_route = require('./routes/extract.route')

mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("connected")
})



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

server.listen(2202, ()=>{
    console.log('server is running on 2202')
});

