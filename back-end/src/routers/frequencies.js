const express = require('express');
const fs = require('fs');
const axios = require('axios');
const router = new express.Router();
const {arraySort, saveJSON, checkCacheFlag, make_GETRequest, clearCoinlist, clearRedditResponse, GET_RedditComments} = require("../helper/functions.js")
const AB_HashTable = require("../helper/AB_hashtable")

const coin_list_path = "./src/crypto-cache/data.json"       // path to hold coinlist
const reddit_author = "AutoModerator"                       // hardcode "automoderator" as author to only get the daily discussion!

// endpoints
router.get("/frequencies", checkCacheFlag, async (req, res, next) => {
    try{
        // get frequencies for all coins
        let coinlist = []
        if(!req.app.cacheFlag || !fs.existsSync("./src/crypto-cache/data.json")){
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
            // console.log(coinlist[1])
        }

        // get all comments from reddit
        // for now, get cached file!
        let eric = await GET_RedditComments(1)
        // const reddit_response = JSON.parse(fs.readFileSync('./src/crypto-cache/response2.json', {encoding:'utf8', flag:'r'}));
        // const [ ids, comment_tokens ] = clearRedditResponse(reddit_response)
        // console.log(comment_tokens)
        // console.log(ids.size)
        // populate hashtable
        // var comment_ht = new AB_HashTable()
        // comment_ht.populate(comment_tokens)
        // comment_ht.printHT()
        // // console.log(coinlist)
        // let sorted = comment_ht.searchArray_sorted(coinlist)
        // console.log(sorted)

    } catch (e) {
        console.log(e)
        res.status(500).send();
    }
})


module.exports = router