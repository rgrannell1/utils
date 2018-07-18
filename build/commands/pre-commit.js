
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

command.task = async args => {
  const name = await branch(constants.paths.root)

  if (name.includes('master')) {
    console.error('\nWill not commit directly to master line; merge in from github from a feature branch-s\n')
    process.exit(1)
  }

  const hasPrefix = constants.allowedBranchPrefixes.some(prefix => {
    return name.startsWith(prefix)
  })

  if (!hasPrefix) {
    console.error(`\nunsupported prefix on branch "${name}"; supported prefixes are ${constants.allowedBranchPrefixes.join(', ')}\n`)
    process.exit(1)
  }
}

module.exports = command
