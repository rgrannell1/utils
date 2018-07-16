
const constants = require('../constants')
const utils = require('../utils')
const {npm} = require('@rgrannell/build')

const command = {
  name: 'install-deps',
  dependencies: ['assert-valid-packages']
}

command.cli = `
Usage:
  script install-deps

Description:
  Install npm dependencies for each package
`

command.task = async args => {
  const packages = utils.listPackageJsons(constants.paths.packages)
  const startDir = process.cwd()

  try {
    for (let pck of await packages) {
      process.chdir(pck.path)
      npm.install({production: false})
    }
  } catch (err) {
    throw err
  } finally {
    process.chdir(startDir)
  }
}

module.exports = command
