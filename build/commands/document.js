
const documentation = require('documentation')
const fs = require('fs').promises
const md = require('@rgrannell/markdown')
const oUtils = require('@rgrannell/object')
const build = require('../commands')
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

const license = `
Copyright (c) ${(new Date()).getFullYear()} Ryan Grannell

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`

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
    'version'
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
