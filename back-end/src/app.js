const express = require('express');
const bodyParser = require('body-parser');

// express
const app = express();
app.use(express.json());

// headers
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));


/***  ENDPOINTS ***/
// frequencies
const freqRouter = require('./routers/frequencies');
app.use(freqRouter);

module.exports = app