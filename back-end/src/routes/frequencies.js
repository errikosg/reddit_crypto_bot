const express = require('express');
const fs = require('fs');
const router = express.Router();
const AB_HashTable = require("../helper/AB_hashtable")
const { saveJSON,
    checkCacheFlag,
    make_GETRequest,
    extractCoinlist,
    clearRedditResponse,
    GET_dailydisc_test,
    PopulateFromPosts,
    GET_SubmissionPosts
} = require("../helper/functions.js")


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
        // const daily_discussions = await GET_SubmissionPosts("AutoModerator", 1, null)
        const daily_discussions = await GET_dailydisc_test()
        if(daily_discussions.length == 0){
            res.status(401).json({ msg: "No daily discussions for the day range given" })
        }
        else{
            const url = "https://api.pushshift.io/reddit/search/comment/"
            comment_ht = await PopulateFromPosts(url, daily_discussions, comment_ht)
            if(comment_ht.getSize() > 0){ 
                const sorted = comment_ht.searchArray_sorted(coinlist)
                // console.log(sorted)
                saveJSON(sorted_freq_path, sorted)
                res.json({ msg:"The first 20 results", data: sorted.slice(0,20)})
            }
            else{
                res.status(404).json({ msg: "No mentions found on the Daily Discussions" })
            }
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: "Internal Server Error" });
    }
})

// @route   GET reddit-crypto-bot/frequencies
// @desc    Get the mention frequency in <count> posts of /r/CryptoCurrency, for all cryptocurrencies
// @access  Public
router.get('/posts', checkCacheFlag, async (req, res) => {
    const count = req.query.count || 20
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
        const posts = await GET_SubmissionPosts(null, null, count)
        if(posts.length == 0){
            res.status(401).json({ msg: "No daily discussions for the day range given" })
        }
        else{
            const url = "https://api.pushshift.io/reddit/search/comment/"
            comment_ht = await PopulateFromPosts(url, posts, comment_ht)
            if(comment_ht.getSize() > 0){ 
                const sorted = comment_ht.searchArray_sorted(coinlist)
                // console.log(sorted)
                // saveJSON(sorted_freq_path, sorted)
                res.json({ msg:"The first 20 results", data: sorted.slice(0,20)})
            }
            else{
                res.status(404).json({ msg: `No mentions found on the last ${count} posts` })
            }
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({ msg: "Internal Server Error" });
    }
})


module.exports = router