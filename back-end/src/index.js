const express = require('express');
const cors = require('./middleware/cors')

// setup server
const app = express()
const PORT = process.env.PORT || 5000;
app.use(express.json({ extended: false }));
app.use(cors)

/***  ENDPOINTS ***/
app.use('/reddit-crypto-bot/frequencies', require('./routes/frequencies'));

app.listen(PORT,()=>{
    console.log("Server is up on port " + PORT);
});