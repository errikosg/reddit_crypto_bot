const fs = require('fs');
const axios = require('axios');

// module.exports = {
//     alphaVal: function(s) {
//         return s.toLowerCase().charCodeAt(0) - 97
//     },

//     stringComp: function(s1, s2) {
//         return s1.toLowerCase() === s2.toLowerCase()
//     },

//     arraySort: function (data, column) {
//         data.sort(function(res01, res02) {
//             var arg01 = res01[column];
//             var arg02 = res02[column];
//             if(arg01 > arg02) { return -1; }
//             if(arg01 < arg02) { return 1; }
//             return 0;
//         })
//         return data;
//     },

//     saveJSON: function (path, data) {
//         fs.writeFile (path, JSON.stringify(data), function(err) {
//             if (err) throw err;
//             console.log('# File saved at: ' + path);
//             }
//         );
//     },

//     checkCacheFlag: function(request, response, next){
//         request.app.cacheFlag = (request.headers['custom-cache-data']==1) ? true : false
//         next();
//     },

//     make_GETRequest: async function (url, max_retries, headers, params){
//         // function to make typical GET request

//         let current_tries = 1
//         while(current_tries <= max_retries) {
//             // try 5 times before giving up
//             let response = await axios({
//                 url: url,
//                 method: 'get',
//                 headers: headers,
//                 params
//             })
//             if(response.status == 200)
//                 return response
//             current_tries+=1
//         }
//         return response
//     }, 

//     clearCoinlist: function (raw_data) {
//         return raw_data.map( (item) => {
//             return {name: item.name, symbol: item.symbol}
//         })
//     },

//     clearRedditResponse: function (raw_data) {
//         // input: reddit response
//         // return: { unique set of ids, array of cleared sentence tokens }

//         notletterCheck = function(c) {
//             // true: not letter / false: letter
//             let cval = c.charCodeAt(0)
//             return (cval<'A'.charCodeAt(0) || cval>'z'.charCodeAt(0))
//         }

//         let stopwords = ['i','me','my','myself','we','our','ours','ourselves','you','your','yours','yourself','yourselves','he','him','his','himself','she','her','hers','herself','it','its','itself','they','them','their','theirs','themselves','what','which','who','whom','this','that','these','those','am','is','are','was','were','be','been','being','have','has','had','having','do','does','did','doing','a','an','the','and','but','if','or','because','as','until','while','of','at','by','for','with','about','against','between','into','through','during','before','after','above','below','to','from','up','down','in','out','on','off','over','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','s','t','can','will','just','don','should','now']
//         let regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
//         let raw_comms = raw_data.map( (item) => {
//             return {id: item.id, body: item.body}
//         })
//         const ids = new Set()
//         // seperate ids and bodies
//         let comms = []
//         for(let obj of raw_comms){
//             comms.push(obj.body)
//             ids.add(obj.id)
//         }
//         // clear punctuation
//         let clear_comms = []
//         for(let c of comms){
//             let cc = c.replace(regex,'')
//             clear_comms.push(cc)
//         }
//         //tokenize
//         let tokens = []
//         for(let c of clear_comms){
//             let arr = c.split(/\s|\b/)
//             tokens.push(arr)
//         }
//         // remove stowords
//         let cleared_tokens = []
//         for(let arr of tokens){
//             let new_arr = []
//             // check each word independently
//             for(let i=0; i<arr.length; i++){
//                 let lowered = arr[i].toLowerCase()
//                 if(!(stopwords.includes(lowered)) && lowered != undefined && lowered.length > 0 && !notletterCheck(lowered)){
//                     new_arr.push(lowered)
//                 }
//             }
//             cleared_tokens.push(new_arr)
//         }
//         return [ ids, cleared_tokens ]
//     }
// }

function alphaVal(s) {
    return s.toLowerCase().charCodeAt(0) - 97
}

function stringComp(s1, s2) {
    return s1.toLowerCase() === s2.toLowerCase()
}

function arraySort(data, column) {
    data.sort(function(res01, res02) {
        var arg01 = res01[column];
        var arg02 = res02[column];
        if(arg01 > arg02) { return -1; }
        if(arg01 < arg02) { return 1; }
        return 0;
    })
    return data;
}

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


    let raw_comms = raw_data.map( (item) => {
        return {id: item.id, body: item.body}
    })
    const ids = new Set()
    // seperate ids and bodies
    let comms = []
    for(let obj of raw_comms){
        comms.push(obj.body)
        ids.add(obj.id)
    }
    // clear punctuation
    let clear_comms = []
    for(let c of comms){
        let cc = c.replace(link_regex,'').replace(regex, "").replace(/\s+/g, " ");
        clear_comms.push(cc)
    }
    //tokenize
    let tokens = []
    for(let c of clear_comms){
        let arr = c.split(/\s|\b/)
        tokens.push(arr)
    }
    // remove stowords
    let cleared_tokens = []
    for(let arr of tokens){
        let new_arr = []
        // check each word independently
        for(let i=0; i<arr.length; i++){
            let lowered = arr[i].toLowerCase()
            if(!(stopwords.includes(lowered)) && lowered != undefined && lowered.length > 0 && !notletterCheck(lowered)){
                new_arr.push(lowered)
            }
        }
        cleared_tokens.push(new_arr)
    }
    return [ ids, cleared_tokens ]
}

async function GET_DailyDiscussions(day_count) {
    // get the daily discussion submissions of the last <day_count> days
    const url = "https://api.pushshift.io/reddit/search/submission/"
    let after = day_count+"d"
    const params = {
        "after": after,
        "subreddit": "CryptoCurrency",
        "author": "AutoModerator"
    }
    let response = await make_GETRequest(url, 3, null, params)
    return response.data.data   // return the data array
}

async function GET_RedditComments(day_count) {
    // get all the comments for the specified days given - here we assume for now day_count=1
    // input: day_count = number of daily discussions to scrap
    // output:

    day_count = 1   // fix!
    const daily_discussions = await GET_DailyDiscussions(day_count)
    const url = "https://api.pushshift.io/reddit/search/comment/"
    for(let post of daily_discussions){
        const post_id = post.id
        
    }
}


// export all functions
module.exports = 
{ alphaVal:alphaVal, stringComp:stringComp, arraySort:arraySort, saveJSON:saveJSON, checkCacheFlag:checkCacheFlag, make_GETRequest:make_GETRequest, clearCoinlist:clearCoinlist, clearRedditResponse:clearRedditResponse, GET_RedditComments:GET_RedditComments };