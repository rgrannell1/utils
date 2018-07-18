
const branch = require('git-branch')
const constants = require('../constants')

const command = {
  name: 'pre-commit',
  dependencies: ['lint', 'depcheck']
}

command.cli = `
Usage:
  script pre-commit

Description:
  Run precommit checks against this repository.
`

const assert = {}

assert.notMaster = name => {
  if (name.includes('master')) {
    console.error('\nWill not commit directly to master; merge in from github from a feature branch-s\n')
    process.exit(1)
  }
}

assert.validBranchName = (name, validPrefixes) => {
  const hasPrefix = validPrefixes.some(prefix => {
    return name.startsWith(prefix)
  })

  if (!hasPrefix) {
    console.error(`\nunsupported prefix on branch "${name}"; supported prefixes are ${validPrefixes.join(', ')}\n`)
    process.exit(1)
  }
}

command.task = async args => {
  const name = await branch(constants.paths.root)

  assert.notMaster(name)
  assert.validBranchName(name, constants.allowedBranchPrefixes)
}

module.exports = command
