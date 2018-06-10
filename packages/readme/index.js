
const markdown = require('@rgrannell/markdown')

const readme = {
  package: {}
}

readme.package.extractMetadata = path => {
  try {
    var package = require(path)
  } catch (err) {
    throw new Error(`failed to read package in "${path}"`)
  }
}

module.exports = readme
