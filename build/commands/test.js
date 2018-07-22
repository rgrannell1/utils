
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

const summarise = {}

summarise.failed = (pkg, test, count) => {
  const summary = {
    testCase: test.tcase
  }
  return `not ok ${count} - ${pkg.data.json.name}` +
    '\n  ---\n' +
    YAML.stringify(summary, 4) +
    '\n  ...'
}

summarise.errored = (pkg, test, count) => {
  const summary = {
    testCase: test.tcase
  }
  return `not ok ${count} - ${pkg.data.json.name}` +
    '\n  ---\n' +
    YAML.stringify(summary, 4) +
    '\n  ...'
}

summarise.passed = (pkg, test, count) => {
  const summary = {
    testCase: test.tcase
  }
  return `ok ${count} - ${pkg.data.json.name}` +
    '\n  ---\n' +
    YAML.stringify(summary, 4) +
    '\n  ...'
}

async function reporter (packageResults) {
  const iterable = [].concat.apply([], packageResults)
  let tapReport = 'TAP version 13'

  let count = 0
  for ({pkg, results} of iterable) {
    (await results).results.forEach(result => {
      result.errored().forEach(test => {
        tapReport += '\n' + summarise.errored(pkg, test, count++)
      })
      result.failed().forEach(test => {
        tapReport += '\n' + summarise.failed(pkg, test, count++)
      })
      result.passed().forEach(test => {
        tapReport += '\n' + summarise.passed(pkg, test, count++)
      })
    })
  }
  console.log(tapReport)
  console.log(tapReport)
  console.log(tapReport)
  console.log(tapReport)
  console.log(tapReport)
}

/**
 * Run tests for a particular project
 *
 * @param  {Object} pkg package data
 *
 * @return {Promise<Array<testResult>>    an array of test-results
 */
function testPackage (pkg) {
  const testPath = path.join(pkg.data.path, 'tests/index')
  const testSuite = require(testPath)

  const packageTestResults = Object.keys(testSuite).map(name => {
    const test = testSuite[name]

    if (!test.run) {
      throw new Error(`".run" method missing for "${pkg.data.name}/${name}" missing`)
    }

    return {
      pkg,
      results: test.run()
    }
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

  const results = await Promise.all(testeable.map(testPackage))
  reporter(results)
}

module.exports = command
