const fs = require('fs');
const axios = require('axios');
const AB_HashTable = require("./AB_hashtable")

function saveJSON(path, data) {
    fs.writeFile (path, JSON.stringify(data), function(err) {
        if (err) throw err;
        console.log('# File saved at: ' + path);
        }
    );
}

function checkCacheFlag(request, response, next){
    request.app.cacheFlag = (request.headers['custom-cache-data']==1) ? true : false
    next();
}

async function make_GETRequest(url, max_retries, headers, params){
    // function to make typical GET request
    let current_tries = 1
    while(current_tries <= max_retries) {
        // try 5 times before giving up
        let response = await axios({
            url: url,
            method: 'get',
            headers: headers,
            params
        })
        if(response.status == 200)
            return response
        current_tries+=1
    }
    return response
}

function clearCoinlist(raw_data) {
    return raw_data.map( (item) => {
        return {name: item.name, symbol: item.symbol}
    })
}

function notletterCheck(c) {
    // true: not letter / false: letter
    let cval = c.charCodeAt(0)
    return (cval<'A'.charCodeAt(0) || cval>'z'.charCodeAt(0))
}

function clearRedditResponse(raw_data) {
    // input: reddit response with post comments
    // return: { unique set of ids, array of cleared sentence tokens }

    // define clearing methods
    let stopwords = ['i','me','my','myself','we','our','ours','ourselves','you','your','yours','yourself','yourselves','he','him','his','himself','she','her','hers','herself','it','its','itself','they','them','their','theirs','themselves','what','which','who','whom','this','that','these','those','am','is','are','was','were','be','been','being','have','has','had','having','do','does','did','doing','a','an','the','and','but','if','or','because','as','until','while','of','at','by','for','with','about','against','between','into','through','during','before','after','above','below','to','from','up','down','in','out','on','off','over','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','s','t','can','will','just','don','should','now']
    let link_regex = 'https?:\/\/[^ ]*'
    let regex = /[^\w\s]|_/g;


    let comms = raw_data.map( (item) => {
        return {id: item.id, created_utc: item.created_utc, body: item.body}
    })

    // template: array of {id , created_utc, body}
    for(let pair of comms){
        pair.body = pair.body.replace(link_regex,'').replace(regex, "").replace(/\s+/g, " ");   // clear punctuation
        let arr = pair.body.split(/\s|\b/)
        pair.body = arr                                                                         // tokenize
        arr = []            // clear to use again
        for(let i=0; i<pair.body.length; i++){                                                  // remove stopwords and more
            // let lowered = pair.body[i].toLowerCase()
            let lowered = pair.body[i]
            if(!(stopwords.includes(lowered)) && lowered != undefined && lowered.length > 0 && !notletterCheck(lowered)){
                arr.push(lowered)
            }
        }
        pair.body = arr
    }
    return comms
}

async function GET_DailyDiscussions(day_count) {
    // get the daily discussion submissions of the last <day_count> days
    const url = "https://api.pushshift.io/reddit/search/submission/"
    const reddit_author = "AutoModerator"       // hardcode "automoderator" as author to only get the daily discussion!
    let after = day_count+"d"
    const params = {
        "after": after,
        "subreddit": "CryptoCurrency",
        "author": reddit_author
    }
    let response = await make_GETRequest(url, 3, null, params)
    return response.data.data       // return the data array
}

async function GET_dailydisc_test(){
    // for testing, in case PushShift is down
    const url = "https://api.pushshift.io/reddit/search/submission/"
    const reddit_author = "AutoModerator"       // hardcode "automoderator" as author to only get the daily discussion!
    const params = {
        "subreddit": "CryptoCurrency",
        "author": reddit_author
    }
    let response = await make_GETRequest(url, 3, null, params)
    let data = response.data.data

    // return either the first entry, or empty array
    if(data.length > 0)
        return [data[0]]
    else
        return []
}

async function GET_AllRedditComments(day_count, ht) {
    // get all the comments for the specified days given - here we assume for now day_count=1
    // input: day_count=number of daily discussions to scrap / ht=hashtable to store comments
    // output: hashtabe with all comments

    // set constants
    day_count = 1   // fix!
    console.log("# Getting daily discussion list.")
    // const daily_discussions = await GET_DailyDiscussions(day_count)
    const daily_discussions = await GET_dailydisc_test()        // for testing, in case PushShift is down
    if(daily_discussions.length == 0){
        console.log("# No daily discussions for the day range given.")
        return ht
    }
    const url = "https://api.pushshift.io/reddit/search/comment/"
    const max_size = 100        // important! always check the official API and update if changed
    const max_iter = 20         // max iteration to end search - for testing

    // handle requests
    let params = {
        "subreddit":"CryptoCurrency", "size":max_size, "link_id":"", "before":"" 
    }
    for(let post of daily_discussions){
        const post_id = post.id
        console.log("# Getting comments for post: " + post_id)

        params.before = Date.now()
        params.link_id = post_id
        const response = await make_GETRequest(url, 2, null, params)
        let data = response.data.data
        let count = 0
        while(data != undefined && data.length == max_size && count < max_iter){
            const comments = clearRedditResponse(data) 
            await ht.populate(comments)

            // fix next iteration
            params.before = data[data.length-1].created_utc
            const response = await make_GETRequest(url, 2, null, params)
            data = response.data.data
            setTimeout(() => {  count+= 1;  }, 500);        // wait a little to request again
        }

        return ht
    }
}


// export all functions
module.exports = 
{ saveJSON:saveJSON, checkCacheFlag:checkCacheFlag, make_GETRequest:make_GETRequest, clearCoinlist:clearCoinlist, clearRedditResponse:clearRedditResponse, GET_AllRedditComments:GET_AllRedditComments, GET_dailydisc_test:GET_dailydisc_test };