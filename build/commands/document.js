
const documentation = require('documentation')
const fs = require('fs').promises
const md = require('@rgrannell/markdown')
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
    const {description, version} = doc.json

    const tableOfContent = toc(doc.docs.join('\n')).content

    const packageDocs = md.document([
      md.h1(`${doc.name} (v${version})`),
      '',
      md.h2('Table of Contents'),
      '',
      tableOfContent,
      '',
      description,
      ''
    ].concat(doc.docs))

    return fs.writeFile(path.join(constants.paths.docs, `${doc.name}.md`), packageDocs)
  })

  return Promise.all(writeDocs)
}

module.exports = command
