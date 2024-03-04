const stringSimilarity = require('string-similarity')

const compareNames = (name1, name2,threshold) => {

    const tl1 = name1.toLowerCase()
    const tl2 = name2.toLowerCase()

    const similarity = stringSimilarity.compareTwoStrings(tl1, tl2)


    // console.log("here",similarity)
    // Return true if similarity is above the threshold, indicating a match
    return similarity >= threshold;

}


module.exports = compareNames