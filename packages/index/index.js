
const fs = require('fs')
const path = require('path')

const index = {}

/**
 * Convert a filename to a javascript property name
 *
 * @param  {string} fileName    a file path
 *
 * @return {string}             a property name
 */
index.deriveName = fileName => {
  const base = path.basename(fileName)
  const name = path.parse(base).name
  return name.split('-').map((part, ith) => {
    return ith === 0
      ? part
      : `${part[0].toUpperCase()}${part.slice(1)}`
  }).join('')
}

/**
 * Load modules from all files in a directory into an object of modules
 *
 * @param  {Object} opts    options used to configure module-loading.
 * @return {Object}         returns an object of submodules exports.
 */
index.load = opts => {
  let defaulted = Object.assign({
    source: __dirname
  }, opts)

  const source = path.resolve(defaulted.source)

  const contents = fs.readdirSync(source)
  const targetFiles = contents
    .filter(item => {
      const fullPath = path.join(source, item)
      return fs.lstatSync(fullPath).isFile()
    })
    .map(item => path.join(source, item))

  const modules = {}

  targetFiles.forEach(file => {
    const moduleName = index.deriveName(file)
    modules[moduleName] = require(file)
  })

  return modules
}

module.exports = index