
const constants = require('../constants')
const utils = require('../utils')

const chalk = require('chalk')
const depcheck = require('depcheck')
const set = require('@rgrannell/set')

const command = {
  name: 'depcheck',
  dependencies: []
}

command.cli = `
Usage:
  script depcheck

Description:
  Find unused dependencies
`

const runDepcheck = path => {
  return new Promise((resolve, reject) => {
    depcheck(path, {}, response => {
      resolve(response)
    })
  })
}

command.task = async args => {
  const packages = utils.listPackageJsons(constants.paths.packages)

  const table = []
  for (let pck of await packages) {
    const analysis = await runDepcheck(pck.path)

    const requires = new Set(analysis.dependencies)
    const using = new Set(Object.keys(analysis.using))
    const unused = [...set.diff(using, requires)]

    if (unused.length > 0) {
      table.push({
        name: pck.name,
        unused: unused.join(', ')
      })
    }
  }

  if (table.length === 0) {
    return
  }

  let message = chalk.red(`\n${table.length} modules have unused dependencies!\n\n`)

  for (const {name, unused} of table) {
    message += ` ${name.padEnd(20)}${unused}\n`
  }
  message += '\n'
  console.log(message)
}

module.exports = command

/**

console.log(unused.dependencies); // an array containing the unused dependencies
console.log(unused.devDependencies); // an array containing the unused devDependencies
console.log(unused.missing); // a lookup containing the dependencies missing in `package.json` and where they are used
console.log(unused.using); // a lookup indicating each dependency is used by which files

*/
