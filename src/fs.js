
const fsNative = require('fs')
const readline = require('readline')

const fs = {}

fs.readLines = (readStream, onLine) => {
  readline.createInterface({input: readStream})
    .on('line', line => onLine(line, false))
    .on('close', ( ) => {
  	  onLine(null, true)
    })
}

module.exports = fs
