
const fsNative = require('fs')
const readline = require('readline')
const crypto = require('crypto')
const stream = require('./stream')
const cpr = require('cpr')
const rmfr = require('rmfr')
const mkdirp = require('mkdirp-promise')

const fs = {}

/**
 *
 * @param {string} the path to read from.
 *
 * @returns {Promise} promise containing file content.
 *
 */

fs.readFile = path => {
  return new Promise((resolve, reject) => {
    return fsNative.readFile(path, (err, res) => {
      err ? reject(err) : resolve(res)
    })
  })
}

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

/**
 *
 * @param {string} path the path to write to.
 * @param {string} content the content to write to a file
 *
 * @returns {Promise} a result promise.
 */
fs.writeFile = (path, input) => {
  const reader = stream.isReadable(input)
    ? input
    : stream.asReadStream(input)

  return new Promise((resolve, reject) => {
    reader.pipe(fsNative.createWriteStream(path))
      .on('error', reject)
      .on('finish', () => resolve(path))
  })
}

fs.writeTmpFile = input => {
  const reader = stream.isReadable(input)
    ? input
    : stream.asReadStream(input)

  return new Promise((resolve, reject) => {

    const tpath = fs.tmpPath()
    reader.pipe(fsNative.createWriteStream(tpath))
      .on('error', reject)
      .on('finish', () => resolve(tpath))
  })
}

fs.testFile = path => {
  if (!path) {
    throw new Error('path not provided.')
  }

  return new Promise((resolve, reject) => {
    fsNative.stat(path, err => {
      if (err) {
        if (err.code === 'ENOENT') {
          resolve(false)
        } else {
          reject(err)
        }
      } else {
        resolve(true)
      }
    })
  })
}

/**
 *
 * @param {string} source the path to copy
 * @param {string} source the destination of the file
 *
 * @returns {Promise} a result promise.
 */
fs.copy = (source, dest) => {
  return new Promise((resolve, reject) => {
    fsNative.copyFile(source, dest, err => {
      err ? reject(err) : resolve()
    })
  })
}

/**
 *
 * @param {string} path the path to create.
 *
 * @returns {Promise} a result promise.
 */
fs.mkdir = path => {
  return mkdirp(path)
}


/**
 *
 * @param {string} path the path to remove.
 *
 * @returns {Promise} a result promise.
 */
fs.removeFolder = path => {
  return rmfr(path)
}

/**
 *
 * @param {string} source the folder to copy
 * @param {string} source the destination of the folder
 *
 * @returns {Promise} a result promise.
 */
fs.copyDir = (source, dest) => {
  return new Promise((resolve, reject) => {
    const opts = {
      deleteFirst: true,
      overwrite: true,
      confirm: true
    }
    cpr(source, dest, opts, err => {
      err ? reject(err) : resolve()
    })
  })
}

module.exports = fs
