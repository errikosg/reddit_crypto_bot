const cors = (req, res, next) => {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    // Request headers you wish to allow
   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');

    // Pass to next layer of middleware
    next();
}

module.exports = cors;