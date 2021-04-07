const {alphaVal, arraySort} = require("../helper/functions.js")

module.exports = class AB_HashTable {
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
            // console.log(s)
            for(var word of s){
                if(word[0] == undefined)
                    continue
                // console.log(word)
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