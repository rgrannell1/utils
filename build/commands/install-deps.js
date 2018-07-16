
const constants = require('../constants')
const utils = require('../utils')
const {npm} = require('@rgrannell/build')
const pulp = require('@rgrannell/pulp')

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

command.task = async (args, emitter) => {
  const packages = utils.listPackageJsons(constants.paths.packages)
  const startDir = process.cwd()

  try {
    const pkgData = await packages
    for (let [index, pck] of pkgData.entries()) {
      emitter.emit(pulp.events.subTaskProgress, `Installing package ${pck.name} 🎁 [${index} / ${pkgData.length}]`)

      process.chdir(pck.path)
      try {
        await npm.install({production: false})
      } catch (err) {
        throw new Error(`failed to install module "${pck.name}: ${err.message}"`)
      }
    }
  } catch (err) {
    throw err
  } finally {
    process.chdir(startDir)
  }
}

module.exports = command
