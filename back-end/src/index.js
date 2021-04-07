const express = require('express');

const app = require('./app');
const server = express();
server.use('/reddit-crypto-bot', app);

// setup server
const port = process.env.PORT;
server.listen(port,()=>{
    console.log("Server is up on port " + port);
});