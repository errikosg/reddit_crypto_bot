const express = require('express');
const fs = require('fs');
const axios = require('axios');
const router = new express.Router();
const { saveJSON, checkCacheFlag, make_GETRequest, clearCoinlist, GET_AllRedditComments} = require("../helper/functions.js")
const AB_HashTable = require("../helper/AB_hashtable")

const coin_list_path = "./src/crypto-cache/coinlist.json"       // path to hold coinlist
const sorted_freq_path = "./src/crypto-cache/sorted_freqs.json"

// endpoints
router.get("/frequencies", checkCacheFlag, async (req, res, next) => {
    try{
        // get frequencies for all coins
        let coinlist = []
        if(!req.app.cacheFlag || !fs.existsSync(coin_list_path)){
            // cached crypto file wasn't asked for or doesn't exist. A request is made to CMC
            let headers = { 'X-CMC_PRO_API_KEY': process.env.SECRET }
            const response = await make_GETRequest('https://pro-api.coinmarketcap.com/v1/cryptocurrency/map', 5, headers, null)     // get coinlist
            if(response.status == 200){
                coinlist = clearCoinlist(response.data.data);
                // console.log(coinlist[0])
                saveJSON(coin_list_path, coinlist)  // cache
            }
            else {
                // retreival of coinlist from CMC failed
                res.status(404).send();
            }
        }
        else{
            // retreive cached file with CMC coin list
            coinlist = JSON.parse(fs.readFileSync(coin_list_path, {encoding:'utf8', flag:'r'}));
        }

        // get all comments from reddit
        var comment_ht = new AB_HashTable()
        comment_ht = await GET_AllRedditComments(1, comment_ht)
        let sorted = comment_ht.searchArray_sorted(coinlist)        // get the sorted list!
        console.log(sorted)
        saveJSON(sorted_freq_path, sorted)          // cache
    } catch (e) {
        console.log(e)
        res.status(500).send();
    }
})


module.exports = router