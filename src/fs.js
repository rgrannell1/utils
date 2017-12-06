
const fsNative = require('fs')
const readline = require('readline')
const crypto = require('crypto')
const stream = require('./stream')

const fs = {}

fs.readLines = (readStream, onLine) => {
  readline.createInterface({input: readStream})
    .on('line', line => onLine(line, false))
    .on('close', ( ) => {
  	  onLine(null, true)
    })
}

fs.tmpPath = (ext = '.png') => {
  return `/tmp/foo/${crypto.randomBytes(20).toString('hex')}${ext}`
}

fs.writeFile = (path, input) => {
  const reader = stream.isReadable(input)
    ? input
    : fs.asReadStream(input)

  return new Promise((resolve, reject) => {
    reader.pipe(fsNative.createWriteStream(path))
      .on('error', reject)
      .on('finish', () => resolve(path))
  })
}

fs.writeTmpFile = input => {
  const reader = stream.isReadable(input)
    ? input
    : fs.asReadStream(input)

  return new Promise((resolve, reject) => {

    const tpath = fs.tmpPath()
    reader.pipe(fsNative.createWriteStream(tpath))
      .on('error', reject)
      .on('finish', () => resolve(tpath))
  })
}

module.exports = fs
