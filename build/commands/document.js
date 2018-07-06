
const fs = require('fs').promises
const path = require('path')
const documentation = require('documentation')
const md = require('@rgrannell/markdown')

const constants = {
  paths: {
    packages: path.join(__dirname, '../../packages'),
    docs: path.join(__dirname, '../../docs')
  }
}

const command = {
  name: 'document',
  dependencies: []
}

command.cli = `
Usage:
  script document
Description:
  Generate package documentation.
`

const listTargets = async packages => {
  const files = await fs.readdir(packages)
  const packageJsons = await Promise.all(files)

  return packageJsons
    .map(dir => path.join(packages, dir, 'package.json'))
    .map(jsonPath => {
      try {
        return {
          package: path.dirname(jsonPath),
          data: require(jsonPath)
        }
      } catch (err) {
        throw new Error(`could not require "${jsonPath}"`)
      }
    })
    .map(packageJson => {
      if (!packageJson.data.main) {
        throw new Error(`package.json for "${path.basename(packageJson.data.main)}" did not have main field`)
      }
      return {
        package: packageJson.package,
        main: path.join(packageJson.package, packageJson.data.main),
        data: packageJson.data
      }
    })
}

const generateJsonDocs = async path => {
  const mains = await listTargets(path)
  return Promise.all(mains.map(async ({main, package, data}) => {
    const buildData = await documentation.build([main], {})
    const parsedData = await documentation.formats.md(buildData, {})

    return {
      main,
      package,
      docs: parsedData.split('\n'),
      data
    }
  }))
}

command.task = async args => {
  const docs = await generateJsonDocs(constants.paths.packages)

  const writeDocs = docs.map(doc => {
    const packageName = path.basename(doc.package)

    const packageDocs = md.document([
      md.h1(`${packageName} (v${doc.data.version})`),
      ''
    ].concat(doc.docs))

    return fs.writeFile(path.join(constants.paths.docs, `${packageName}.md`), packageDocs)
  })

  return Promise.all(writeDocs)
}

module.exports = command
