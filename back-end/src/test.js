var fs = require('fs');

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
const comments = [["ena", "duo", "tria"], ["ena", "ena"], ["duo", "tria", "tessera"]]
class AB_HashTable {
    // hashtable that stores strings alphabetically only
    constructor(){
        this.indexArrayLength = 26
        this.indexArray = [];
        for(var i=0; i<this.indexArrayLength; i++)
            this.indexArray.push({})
    }

    printHT(){
        console.log("# Printing structure:\n")
        console.log(this.indexArray)
        console.log("\n")
    }

    populate(comments){
        // populate the hash table with the given words
        // for each letter, we have a dictionary with each word's frequency
        console.log("# Populating.")
        for(var s of comments){
            for(var word of s){
                const index = alphaVal(word[0])
                // console.log(word + " has index " + index)
                if(word in this.indexArray[index]){
                    // console.log(word + " found. Updating at index " + index)
                    this.indexArray[index][word] += 1
                }
                else{
                    // console.log(word + " not found. Inserting at index " + index)
                    this.indexArray[index][word]= 1
                }
            }
        }
    }

    searchSingle(obj){
        // for a single given coin, find its frequency
        console.log("# Searching single.")
        const name = obj.name.toLowerCase()
        const symbol = obj.symbol.toLowerCase()
        const index = alphaVal(name[0])
        var freq = 0;

        // below we make sure that both name and symbol are searched
        if(name in this.indexArray[index])
            freq += this.indexArray[index][name]
        if(symbol != name && symbol in this.indexArray[index])      // check if symbol and name are the same
            freq += this.indexArray[index][symbol]
        return freq
    }

    searchArray(array){
        // given an array of words(cryptos), find the frequency for each one
        console.log("# Searching array.")
        var freqs = []
        for (const obj of array){
            const name = obj.name.toLowerCase()
            const symbol = obj.symbol.toLowerCase()
            const index = alphaVal(name[0])
            var freq = 0
            if(name in this.indexArray[index])
                freq += this.indexArray[index][name]
            if(symbol != name && symbol in this.indexArray[index])      // check if symbol and name are the same
                freq += this.indexArray[index][symbol]
            freqs.push({name:obj.name, symbol: obj.symbol, frequency: freq})
        }
        return freqs
    }
}
var ht = new AB_HashTable()
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
saveJSON("./crypto-cache/freqs.json", sorted)