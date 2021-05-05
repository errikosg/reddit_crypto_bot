const fs = require('fs');
const axios = require('axios');
const natural = require('natural');
const stopword = require('stopword');
const AB_HashTable = require("./AB_hashtable")

// Save object as json file
function saveJSON(path, data) {
    fs.writeFile (path, JSON.stringify(data), (err) => {
        if (err) throw err;
        console.log('# File saved at: ' + path);
        }
    );
}

// Check if optional cache flag is passed   
function checkCacheFlag(request, response, next){
    request.app.cacheFlag = (request.headers['custom-cache-data']==1) ? true : false
    next();
}

// Make typical GET request
async function make_GETRequest(url, headers, params, max_retries=5){
    let current_tries = 1
    while(current_tries <= max_retries) {
        let res = await axios({
            url,
            method: 'get',
            headers,
            params
        })
        if(res.status == 200)
            return res
        current_tries+=1
    }
    return res
}

// Extract the wanted data from the response
function extractCoinlist(raw_data) {
    return raw_data.map( (item) => {
        return {name: item.name, symbol: item.symbol}
    })
}

// true: not letter / false: letter
function notletterCheck(c) {
    let cval = c.charCodeAt(0)
    return (cval<'A'.charCodeAt(0) || cval>'z'.charCodeAt(0))
}

// Text processing of the comments
function clearRedditResponse(raw_data) {
    // input: reddit response with post comments
    // return: { unique set of ids, array of cleared sentence tokens }

    // define clearing methods
    let link_regex = 'https?:\/\/[^ ]*'
    let regex = /[^\w\s]|_/g;

    // Template: array of {id, created_utc, body}
    let comms = raw_data.map( (item) => {
        return {id: item.id, created_utc: item.created_utc, body: item.body}
    })

    const { WordTokenizer } = natural;
    const tokenizer = new WordTokenizer();
    for(let pair of comms){
        pair.body = pair.body.replace(link_regex,'').replace(regex, "").replace(/\s+/g, " ");   // clear punctuation
        pair.body = tokenizer.tokenize(pair.body)
        pair.body = stopword.removeStopwords(pair.body)
        // not letter check?
    }

    return comms
}

// Get the daily discussion submissions of the last <day_count> days / AutoModerator for daily discs
async function GET_SubmissionPosts(author, dc, pc) {
    let day_count = dc || 1
    let post_count = pc || 1

    const url = "https://api.pushshift.io/reddit/search/submission/"
    const after = day_count+"d"
    let params = {
        after,
        subreddit: "CryptoCurrency",
    }
    if(author !== null)
        params.author = author
    if(day_count == 1 && post_count > 1)
        params.size = post_count
    const response = await make_GETRequest(url, null, params)
    return response.data.data
}

// For testing, in case PushShift is down - returns the last daily available in the system
async function GET_dailydisc_test(){
    const url = "https://api.pushshift.io/reddit/search/submission/"
    const reddit_author = "AutoModerator"
    const params = {
        "subreddit": "CryptoCurrency",
        "author": reddit_author
    }
    const response = await make_GETRequest(url, null, params)
    let data = response.data.data

    if(data.length > 0)
        return [data[0]]
    else
        return []
}

async function PopulateFromPosts(url, posts, ht) {
    const max_size = process.env.MAX_REQUEST_SIZE || 100
    const max_iter = 5              // max iteration to end search - for testing

    // handle requests
    let params = {
        "subreddit":"CryptoCurrency", "size":max_size, "link_id":"", "before":"" 
    }
    for(let post of posts){
        const { id } = post
        console.log("# Getting comments for post: " + id)

        params.before = Date.now()
        params.link_id = id
        const response = await make_GETRequest(url, null, params)
        let data = response.data.data
        let count = 0
        while(data !== undefined && data.length > 0 && count < max_iter){
            const comments = clearRedditResponse(data) 
            await ht.populate(comments)

            // fix next iteration
            if(data.length < max_size)
                // no more requests to be made
                break;
            params.before = data[data.length-1].created_utc
            const response = await make_GETRequest(url, null, params)
            data = response.data.data
            setTimeout(() => {  count += 1;  }, 500);
        }
    }
    return ht
}

module.exports = { 
    saveJSON,
    checkCacheFlag,
    make_GETRequest,
    extractCoinlist,
    clearRedditResponse,
    GET_dailydisc_test,
    PopulateFromPosts,
    GET_SubmissionPosts
};