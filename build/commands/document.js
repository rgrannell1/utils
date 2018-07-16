
const Obj = require('@rgrannell/object')

const documentation = require('documentation')
const fs = require('fs').promises
const mustache = require('mustache')

const path = require('path')
const toc = require('markdown-toc')

const utils = require('../utils')
const constants = require('../constants')

const command = {
  name: 'document',
  dependencies: ['assert-valid-packages']
}

command.cli = `
Usage:
  script document
Description:
  Generate package documentation.
`

/**
 * generate documentation for a package
 *
 * @param  {string} path to the package.
 * @return {Promise}
 */
const generatePackageDocs = async path => {
  const mains = await utils.listPackageJsons(path)
  return Promise.all(mains.map(async data => {
    const buildData = await documentation.build([data.main], {})
    const parsedData = await documentation.formats.md(buildData, {})

    return Object.assign({}, data, {
      docs: parsedData
    })
  }))
}

const document = {}

/**
 * Create per-packages documentation
 *
 * @param  {Object} args command-line arguments
 * @return {Promises}
 */
document.packages = async args => {
  const template = await fs.readFile(constants.paths.templates.packageReadme)
  const api = await generatePackageDocs(constants.paths.packages)

  const writeDocs = api.map(api => {
    const {description, version} = api.json

    const tableOfContents = toc(api.docs).content

    const vars = {
      name: api.name,
      version,
      description,
      tableOfContents,
      api,
      year: (new Date()).getFullYear()
    }

    return fs.writeFile(path.join(api.path, `README.md`), mustache.render(template.toString(), vars))
  })

  return Promise.all(writeDocs)
}

/**
 * Create overall README
 *
 * @param  {Object} args command-line arguments
 * @return {Promises}
 */
document.utils = async args => {
  const packages = await utils.listPackageJsons(constants.paths.packages)
  const rootPackage = require(path.join(constants.paths.root, 'package.json'))

  const template = await fs.readFile(constants.paths.templates.utilsReadme)
  const vars = Object.assign({}, Object[Obj.restrict](rootPackage, [
    'version',
    'description'
  ]))

  vars.year = (new Date()).getFullYear()
  vars.packages = packages.map(data => {
    return Object.assign({}, Object[Obj.restrict](data.json, ['name', 'version', 'description']), {
      shortName: data.json.name.split('/')[1]
    })
  })
  vars.packageMetadata = packages.map(data => {
    return {
      shortName: data.json.name.split('/')[1],
      dependencies: 'unknown',
      size: 'unknown'
    }
  })
  vars.commands = Object.values(require('.')).map(data => {
    return Object[Obj.restrict](data, ['name', 'dependencies', 'cli'])
  })

  return fs.writeFile(path.join(constants.paths.root, `README.md`), mustache.render(template.toString(), vars))
}

/**
 * Create build documentation
 *
 * @param  {Object} args command-line arguments
 * @return {Promises}
 */
document.build = async args => {
  const template = await fs.readFile(constants.paths.templates.buildReadme)
  const vars = {}

  vars.commands = Object.values(require('.')).map(data => {
    return Object[Obj.restrict](data, ['name', 'dependencies', 'cli'])
  })

  const buildData = await documentation.build([constants.paths.commands], {})
  const parsedData = await documentation.formats.md(buildData, {})

  vars.apiDocs = parsedData

  return fs.writeFile(path.join(constants.paths.buildReadme), mustache.render(template.toString(), vars))
}

/**
 * Generate documentation
 *
 * @param  {Object} args command-line arguments
 * @return {Promise}
 */
command.task = async args => {
  await Promise.all([
    document.packages(args),
    document.utils(args),
    document.build(args)
  ])
}

module.exports = command
