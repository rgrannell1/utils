
const documentation = require('documentation')
const fs = require('fs').promises
const md = require('@rgrannell/markdown')
const build = require('../commands')

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
      docs: parsedData.split('\n')
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
  const docs = await generatePackageDocs(constants.paths.packages)

  const writeDocs = docs.map(doc => {
    const {description, version} = doc.json

    const tableOfContent = toc(doc.docs.join('\n')).content

    const packageDocs = md.document([
      md.h1(`${doc.name} (v${version})`),
      '',
      description,
      '',
      md.h2('Table of Contents'),
      '',
      tableOfContent,
      '',
      'API'
    ].concat(doc.docs).concat([
      md.h2('License'),
      '',
      license
    ]))

    return fs.writeFile(path.join(doc.path, `README.md`), packageDocs)
  })

  return Promise.all(writeDocs)
}

document.utils = async args => {
  const packages = await utils.listPackageJsons(constants.paths.packages)
  const rootPackage = require(path.join(constants.paths.root, 'package.json'))

  const buildSystem = Object.values(require('.')).map(data => {
    return md.document([
      md.h3(data.name),
      '',
      md.list([
        `dependencies: ${data.dependencies}`
      ]),
      '',
      md.code(data.cli),
      ''
    ])
  })

  const packageDocs = md.document([
    md.h1('utils'),
    '',
    '[![Build Status](https://travis-ci.org/rgrannell1/utils.svg?branch=master)](https://travis-ci.org/rgrannell1/utils)',
    '',
    rootPackage.description,
    '',
    md.h2('Packages'),
    '',
    md.list(packages.map(data => {
      const prefix = md.bold(`${data.json.name} (v${data.json.version})`)
      return md.link(`${prefix}: ${data.json.description}`, `../../tree/master/packages/${data.name}`)
    })).join('\n'),
    '',
    md.h2('Build System'),
    '',
    buildSystem.join('\n'),
    '',
    md.h2('License'),
    '',
    license
  ])

  return fs.writeFile(path.join(constants.paths.root, `README.md`), packageDocs)
}

command.task = async args => {
  await document.packages(args)
  await document.utils(args)
}

module.exports = command
