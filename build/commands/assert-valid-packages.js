
const assert = require('assert')

const utils = require('../utils')
const constants = require('../constants')

const command = {
  name: 'assert-valid-packages',
  dependencies: []
}

command.cli = `
Usage:
  script assert-valid-packages

Description:
  Ensure that package configuration is valid
`

command.task = async args => {
  const mains = await utils.listPackageJsons(constants.paths.packages)
  return Promise.all(mains.map(async ({json, name}) => {
    for (const property of ['description', 'version']) {
      assert(json.hasOwnProperty(property), `"${name}" package.json missing property "${property}"`)
    }

    const versionPattern = /^[0-9]+\.[0-9]+\.[0-9]+.*/g

    if (!versionPattern.test(json.version)) {
      throw new Error(`Invalid version "${json.version}" in package "${name}"`)
    }
  }))
}

module.exports = command
