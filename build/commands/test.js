
const fs = require('fs').promises
const path = require('path')
const utils = require('../utils')
const YAML = require('yamljs')
const constants = require('../constants')

const command = {
  name: 'test',
  dependencies: []
}

command.cli = `
Usage:
  script test

Description:
  Run tests for each submodule
`

/**
 * Run tests for a particular project
 *
 * @param  {Object} pkg package data
 *
 * @return {Promise<Array<testResult>>}    an array of test-results
 */
function testPackage (pkg) {
  const testPath = path.join(pkg.data.path, 'tests/runner')

  require(testPath)
}

command.task = async args => {
  const packages = await utils.listPackageJsons(constants.paths.packages)
  const labelledPackages = await Promise.all(packages.map(async data => {
    const indexPath = path.join(data.path, 'tests/runner.js')

    try {
      var exists = (await fs.lstat(indexPath)).isFile()
    } catch (err) {
      exists = false
    }

    return {data, exists}
  }))
  const testeable = labelledPackages.filter(({exists}) => exists)

  if (testeable.length === 0) {
    throw new Error('no tests found.')
  }

  testeable.map(testPackage)
}

module.exports = command
