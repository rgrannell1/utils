
const fs = require('fs').promises
const path = require('path')
const utils = require('../utils')
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
 * @param  {Object} pck package data
 *
 * @return {Promise<Array<testResult>>    an array of test-results
 */
function testPackage (pck) {
  const testPath = path.join(pck.data.path, 'tests/index')
  const testSuite = require(testPath)

  const packageTestResults = Object.keys(testSuite).map(name => {
    const test = testSuite[name]

    if (!test.run) {
      throw new Error(`".run" method missing for "${pck.data.name}/${name}" missing`)
    }

    return test.run()
  })

  return Promise.all(packageTestResults)
}

command.task = async args => {
  const packages = await utils.listPackageJsons(constants.paths.packages)
  const labelledPackages = await Promise.all(packages.map(async data => {
    const indexPath = path.join(data.path, 'tests/index.js')

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

  const testResults = await Promise.all(testeable.map(testPackage))
  // -- finally, report?
}

module.exports = command
