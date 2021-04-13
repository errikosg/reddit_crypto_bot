// module.exports = 

// helping functions
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

/* ---------------------------------------------------*/
// class
module.exports = class AB_HashTable {
    // hashtable that stores strings alphabetically
    constructor(){
        this.indexArrayLength = 26                  // alphabetical store
        this.indexArray = [];                       // hashtable
        for(var i=0; i<this.indexArrayLength; i++)
            this.indexArray.push({})
        this.unique_id_set = new Set()              // to populate hashtable with unique comments only
    }

    getSize(){
        // returns data structure size
        let [size, count] = [0,0]
        while(count < this.indexArrayLength){
            size += Object.keys(this.indexArray[count]).length
            count += 1
        }
        return size
    }

    printHT(){
        console.log("# Printing structure:\n")
        console.log(this.indexArray)
        console.log("\n")
    }

    populate(comments){
        // populate the hash table with the given words
        // for each letter, we have a dictionary with each word's frequency
        console.log("# Populating:")
        let count = 0
        for(let pair of comments){
            //check if comment is unique
            if(!this.unique_id_set.has(pair.id)){
                this.unique_id_set.add(pair.id)
                let comment_body = pair.body
                for(let word of comment_body){
                    if(word[0] == undefined)
                        continue
                    const index = alphaVal(word[0])
                    if(word in this.indexArray[index]){
                        // word found, updating frequency
                        this.indexArray[index][word] += 1
                    }
                    else{
                        // word not found, inserting
                        this.indexArray[index][word] = 1
                    }
                }
                count += 1
            }
        }
        console.log("\t " + count +" comments were unique")
    }

    searchSingle(obj){
        // for a single given coin, find its frequency
        console.log("# Searching single.")
        // const name = obj.name.toLowerCase()
        // const symbol = obj.symbol.toLowerCase()
        const name = obj.name
        const symbol = obj.symbol
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
            // const name = obj.name.toLowerCase()
            // const symbol = obj.symbol.toLowerCase()
            const name = obj.name
            const symbol = obj.symbol
            const index = alphaVal(name[0])
            if(index < 0 || index > 25){
                // in case a coin doesnt start with letter (fix?)
                freqs.push({name:obj.name, symbol: obj.symbol, frequency: 0})
                continue
            }

            var freq = 0
            if(name in this.indexArray[index])
                freq += this.indexArray[index][name]
            if(symbol != name && symbol in this.indexArray[index])      // check if symbol and name are the same
                freq += this.indexArray[index][symbol]
            freqs.push({name:obj.name, symbol: obj.symbol, frequency: freq})
        }
        return freqs
    }

    searchArray_sorted(array){
        let freqs = this.searchArray(array)
        let sorted =  arraySort(freqs, "frequency")
        return sorted
    }
}