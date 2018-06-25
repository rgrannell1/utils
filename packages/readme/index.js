
const markdown = require('@rgrannell/markdown')
const parseFunction = require('parse-function')

const readme = {
  package: {},
  markdown: {}
}

readme.package.analyseValue = (name, value) => {
  const type = typeof value

  var analyser
  if (type === 'function') {
    analyser = readme.package.analyseValue.function
  } else if (type === 'object') {
    analyser = readme.package.analyseValue.object
  }

  return {
    name,
    value,
    type: Object.prototype.toString.call(value).slice(8, -1).toLowerCase(),
    details: analyser(value)
  }
}

readme.package.analyseValue.function = value => {

}

readme.package.analyseValue.object = value => {
  return {
    propCount: Object.keys(value).length,
    props: Object.keys(value)
  }
}

readme.package.extractMetadata = path => {
  try {
    var package = require(path)
  } catch (err) {
    throw new Error(`failed to read package in "${path}"`)
  }

  const metadata = {}

  metadata.exports = Object.keys(package).map(name => {
    return readme.package.analyseValue(name, package[name])
  })

  return metadata
}

readme.package.summariseExports = path => {
  const metadata = readme.package.extractMetadata(path)
  const titles =  metadata.exports.map(exports => {
    return markdown.mono(markdown.h3(exports.name))
  })

  return markdown.document(markdown.list(titles))
}

module.exports = readme
