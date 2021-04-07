var fs = require('fs');
const AB_HashTable = require("./helper/AB_hashtable")

/*-------------------------------------*/
// helpful funcs
const alphaVal = (s) => s.toLowerCase().charCodeAt(0) - 97  // get numeric value of a letter (a=0,b=1,...)
const stringComp = (s1, s2) => { return s1.toLowerCase() === s2.toLowerCase() }
const arraySort = (data, column) => {
    data.sort(function(res01, res02) {
        var arg01 = res01[column];
        var arg02 = res02[column];
        if(arg01 > arg02) { return -1; }
        if(arg01 < arg02) { return 1; }
        return 0;
    })
    return data;
}
const saveJSON = (path, data) => {
    fs.writeFile (path, JSON.stringify(data), function(err) {
        if (err) throw err;
        console.log('File saved.');
    
        // // always check
        const data2 = JSON.parse(fs.readFileSync(path, {encoding:'utf8', flag:'r'}));
        console.log(data2[0])
        }
    );
}

const clearComments = (raw_data) => {
    return raw_data.map( (item) => {
        return {id: item.id, body: item.body}
    })
}
/*-------------------------------------*/


/*// part of the "clearing"
// GET response file... 
// read response file
const obj = JSON.parse(fs.readFileSync('./crypto-cache/response.json', {encoding:'utf8', flag:'r'}));
const raw_data = obj.data
// clear unwanted data, order alphabetically?
const data = raw_data.map( (item) => {
    // return item[{name,symbol}]
    return {name: item.name, symbol: item.symbol}
})
console.log(data)
// save to file! (cache)
saveJSON("./crypto-cache/data.json", data)*/

/*// if cached
const data = JSON.parse(fs.readFileSync("./crypto-cache/data.json", {encoding:'utf8', flag:'r'}));
console.log(data[0])*/

/*-------------------------------------*/
// HashTable class to store comments
// const comments = [["ena", "duo", "tria"], ["ena", "ena"], ["duo", "tria", "tessera"]]

/*var ht = new AB_HashTable()
ht.populate(comments)
ht.printHT()
console.log(ht.searchSingle({ name: 'ENA', symbol: '1' }))

// check the searchArray funtion
result = ht.searchArray([{ name: 'BitShares', symbol: 'BTS' },
{ name: 'Viacoin', symbol: 'VIA' },
{ name: 'DUO', symbol: 'duo' },
{ name: 'I/O Coin', symbol: 'IOC' },
{ name: 'ENA', symbol: '1' }])
console.log(result)

// check sort function
console.log("Sorting")
var sorted = arraySort(result, 'frequency')
console.log(sorted)
saveJSON("./crypto-cache/freqs.json", sorted)*/

/*-----------------------------------------------------------*/
// test tokenization
// let comments2 = [
//     "i me Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consectetur elementum lacus, aliquam mattis nisi dictum sit amet. Praesent aliquam purus sit amet nunc tempus, at mattis enim porttitor. Maecenas in auctor nibh. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus",
//     "Integer sed euismod ante, vel consequat nibh. Praesent accumsan aliquet consequat. Etiam nec tempor dui, et cursus purus. Sed eget consequat massa, eget vulputate tellus. In commodo, lacus eget vehicula imperdiet, nisl elit semper ante, ut porttitor ipsum massa nec leo.",
//     "Integer quis turpis tincidunt, convallis eros eget, semper dui. Cras et malesuada elit"
// ]

let stopwords = ['i','me','my','myself','we','our','ours','ourselves','you','your','yours','yourself','yourselves','he','him','his','himself','she','her','hers','herself','it','its','itself','they','them','their','theirs','themselves','what','which','who','whom','this','that','these','those','am','is','are','was','were','be','been','being','have','has','had','having','do','does','did','doing','a','an','the','and','but','if','or','because','as','until','while','of','at','by','for','with','about','against','between','into','through','during','before','after','above','below','to','from','up','down','in','out','on','off','over','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','s','t','can','will','just','don','should','now']
let regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;

/*let text = comments2[0]
console.log(text)

// punctuation
let text_new = text.replace(regex,'')
console.log(text_new)
// tokenization
let tokens = text_new.split(/\s|\b/)        // split
// stopwords
clean = []
for(let i=0; i<tokens.length; i++){
    // console.log(t)
    if(!tokens[i] in stopwords)
        clean.push(tokens[i])
}*/

/*-----------------------------------------------------------*/
// read comments from reddit
const axios = require('axios');

// let url = "https://api.pushshift.io/reddit/search/comment/?subreddit=CryptoCurrency&before=1d&size=200"
// axios.get(url)
//   .then(function (response) {
//     // handle success
//     console.log(response.data.data);
//     saveJSON("./crypto-cache/response2.json", response.data.data)
//   })
//   .catch(function (error) {
//     // handle error
//     console.log(error);
//   })


/* ---------------------------------------*/
// // lets check!
// const raw_data = JSON.parse(fs.readFileSync('./crypto-cache/response2.json', {encoding:'utf8', flag:'r'}));

let {clearRedditResponse, make_GETRequest} = require("./helper/functions.js")
// const [ ids, comment_tokens ] = clearRedditResponse(raw_data)
// // console.log(comment_tokens)
// // console.log(ids.size)

// // insert in hashtable
// var ht = new AB_HashTable()
// ht.populate(comment_tokens)
// // ht.printHT()
// let freq = ht.searchSingle({"name":"Ethereum","symbol":"ETH"})
// console.log(freq)

// let coinlist = JSON.parse(fs.readFileSync("./crypto-cache/data.json", {encoding:'utf8', flag:'r'}));
// let result = ht.searchArray(coinlist)
// console.log(result)

// console.log("\n\nSorting")
// var sorted = arraySort(result, 'frequency')
// console.log(sorted)

/* ---------------------------------------*/
// get all comments in specified date range!
// url template: 'https://api.pushshift.io/reddit/search/submission?subreddit={}&after={}&before={}&size={}'
// given id, url template: https://api.pushshift.io/reddit/search/comment/?subreddit={}&after={}&before={}&size={}&link_id={}
async function reddit_GETComments (subreddit, after, size, link_id) {
    url = "https://api.pushshift.io/reddit/search/comment/"
    let params = {
        subreddit:subreddit, after:after, size:size, link_id:link_id
    }
    let response = await make_GETRequest(url, 2, null, params)
    console.log(response.data)
}

// reddit_GETComments("CryptoCurrency", "1d", 200, "mlpfu2")