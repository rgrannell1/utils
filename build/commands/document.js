
const documentation = require('documentation')
const fs = require('fs').promises
const oUtils = require('@rgrannell/object')
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

document.packages = async args => {
  const template = await fs.readFile(constants.paths.packageReadmeTemplate)
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

document.utils = async args => {
  const packages = await utils.listPackageJsons(constants.paths.packages)
  const rootPackage = require(path.join(constants.paths.root, 'package.json'))

  const template = await fs.readFile(constants.paths.utilsReadmeTemplate)
  const vars = Object.assign({}, oUtils.restrict(rootPackage, [
    'version',
    'description'
  ]))

  vars.year = (new Date()).getFullYear()
  vars.packages = packages.map(data => {
    return oUtils.restrict(data.json, ['name', 'version', 'description'])
  })
  vars.commands = Object.values(require('.')).map(data => {
    return oUtils.restrict(data, ['name', 'dependencies', 'cli'])
  })

  return fs.writeFile(path.join(constants.paths.root, `README.md`), mustache.render(template.toString(), vars))
}

command.task = async args => {
  await document.packages(args)
  await document.utils(args)
}

module.exports = command
