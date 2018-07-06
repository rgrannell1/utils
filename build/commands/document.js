
const fs = require('fs').promises
const path = require('path')
const documentation = require('documentation')

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
        main: path.join(packageJson.package, packageJson.data.main)
      }
    })
}

command.task = async args => {
  const mains = await listTargets(path.join(__dirname, '../../packages'))
  const jsonDocs = await Promise.all(mains.map(async ({main, package}) => {
    const data = await documentation.build([main], {})
    const parsedData = await documentation.formats.json(data, {})

    return {main, package, docs: JSON.parse(parsedData)}
  }))

  console.log(jsonDocs)
}

module.exports = command
