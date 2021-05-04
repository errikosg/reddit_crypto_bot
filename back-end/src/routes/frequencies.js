const express = require('express');
const fs = require('fs');
const router = express.Router();
const { saveJSON, checkCacheFlag, make_GETRequest, extractCoinlist, GET_DailyComments} = require("../helper/functions.js")
const AB_HashTable = require("../helper/AB_hashtable")

// some constants
const coin_list_path = "./src/crypto-cache/coinlist.json"       // path to list of coins
const sorted_freq_path = "./src/crypto-cache/sorted_freqs.json"


// @route   GET reddit-crypto-bot/frequencies/daily
// @desc    Get the mention frequency in the daily post of /r/CryptoCurrency, for all cryptocurrencies
// @access  Public
router.get("/daily", checkCacheFlag, async (req, res) => {
    try{
        let coinlist = []
        if(!req.app.cacheFlag || !fs.existsSync(coin_list_path)){
            // cached crypto file wasn't asked for or doesn't exist. A request is made to CMC
            let headers = { 'X-CMC_PRO_API_KEY': process.env.SECRET }
            const res = await make_GETRequest('https://pro-api.coinmarketcap.com/v1/cryptocurrency/map', headers, null)     // get coinlist
            if(res.status == 200){
                coinlist = extractCoinlist(res.data.data);
                saveJSON(coin_list_path, coinlist)
            }
            else {
                res.status(404).json({ msg: "Error while trying to access CoinMarketCap" });
            }
        }
        else{
            // retrieve cached file with CMC coin list
            coinlist = JSON.parse(
                fs.readFileSync(coin_list_path, {encoding:'utf8', flag:'r'})
            );
        }

        let comment_ht = new AB_HashTable()
        comment_ht = await GET_DailyComments(comment_ht)
        if(comment_ht.getSize() > 0){ 
            let sorted = comment_ht.searchArray_sorted(coinlist)
            console.log(sorted)
            // saveJSON(sorted_freq_path, sorted)
            res.json({ msg:"The first 20 results", data: sorted.slice(0,20)})
        }
        else{
            res.status(404).json({ msg: "No mentions found on the Daily Discussions" })
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: "Internal Server Error" });
    }
})


module.exports = router