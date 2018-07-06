
const utils = require('../utils')
const constants = require('../constants')

const command = {
  name: 'assert-valid-packages',
  dependencies: []
}

command.cli = `
Usage:
  script assert-valid-packages
`

command.task = async args => {
  const mains = await utils.listPackageJsons(constants.paths.packages)
  return Promise.all(mains.map(async ({json}) => {
    console.log(json)
    console.log(json)
    console.log(json)
    console.log(json)
  }))
}

module.exports = command
