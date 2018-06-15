
const markdown = require('@rgrannell/markdown')
const parseFunction = require('parse-function')

const readme = {
  package: {}
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
    name: value,
    value,
    type: Object.prototype.toString.call(value).slice(8, -1).toLowerCase(),
    details: analyser(value)
  }
}

readme.package.analyseValue.function = value => {
  const parsed = parseFunction({ecmaVersion: 2017}).parse(value)

  return {
    params: parsed.params
  }
}

readme.package.analyseValue.object = value => {
  return {
    propCount: Object.keys(value)
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

module.exports = readme
