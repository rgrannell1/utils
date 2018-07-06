
const fs = require('fs').promises
const path = require('path')
const documentation = require('documentation')
const md = require('@rgrannell/markdown')

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

const generateJsonDocs = async path => {
  const mains = await utils.listPackageJsons(path)
  return Promise.all(mains.map(async data => {
    const buildData = await documentation.build([data.main], {})
    const parsedData = await documentation.formats.md(buildData, {})

    return Object.assign({}, data, {
      docs: parsedData.split('\n')
    })
  }))
}

command.task = async args => {
  const docs = await generateJsonDocs(constants.paths.packages)

  const writeDocs = docs.map(doc => {
    const packageDocs = md.document([
      md.h1(`${doc.packageName} (v${doc.json.version})`),
      '',
      doc.json.description,
      ''
    ].concat(doc.docs))

    return fs.writeFile(path.join(constants.paths.docs, `${doc.packageName}.md`), packageDocs)
  })

  return Promise.all(writeDocs)
}

module.exports = command
