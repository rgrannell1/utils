
const fs = require('fs').promises
const path = require('path')

const utils = {}

utils.listPackageJsons = async packages => {
  const files = await fs.readdir(packages)
  const packageJsons = await Promise.all(files)

  return packageJsons
    .map(dir => path.join(packages, dir, 'package.json'))
    .map(jsonPath => {
      try {
        const packagePath = path.dirname(jsonPath)
        return {
          path: packagePath,
          name: path.basename(packagePath),
          json: require(jsonPath)
        }
      } catch (err) {
        throw new Error(`could not require "${jsonPath}"`)
      }
    })
    .map(data => {
      if (!data.json.main) {
        throw new Error(`package.json for "${path.basename(data.json.main)}" did not have main field`)
      }

      return Object.assign({}, data, {
        main: path.join(data.path, data.json.main)
      })
    })
}

module.exports = utils
