
const markdown = require('@rgrannell/markdown')

const readme = {
  pkg: {},
  markdown: {}
}

readme.pkg.analyseValue = (name, value) => {
  const type = typeof value

  var analyser
  if (type === 'function') {
    analyser = readme.pkg.analyseValue.function
  } else if (type === 'object') {
    analyser = readme.pkg.analyseValue.object
  }

  return {
    name,
    value,
    type: Object.prototype.toString.call(value).slice(8, -1).toLowerCase(),
    details: analyser(value)
  }
}

readme.pkg.analyseValue.function = value => {

}

readme.pkg.analyseValue.object = value => {
  return {
    propCount: Object.keys(value).length,
    props: Object.keys(value)
  }
}

readme.pkg.extractMetadata = path => {
  try {
    var pkg = require(path)
  } catch (err) {
    throw new Error(`failed to read pkg in "${path}"`)
  }

  const metadata = {}

  metadata.exports = Object.keys(pkg).map(name => {
    return readme.pkg.analyseValue(name, pkg[name])
  })

  return metadata
}

/**
 * Summarise a packages exports
 *
 * @param  {string} path    the package path
 *
 * @return {string}         a markdown document describing a package's exports
 */
readme.pkg.summariseExports = path => {
  const metadata = readme.pkg.extractMetadata(path)
  const titles = metadata.exports.map(exports => {
    const header = markdown.h3(markdown.mono(exports.name))

    return header
  })

  return markdown.document(titles)
}

module.exports = readme
