
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

  console.log(name)
  console.log(name)
  console.log(name)
  console.log(name)
  console.log(name)

  if (name.includes('master')) {
    console.error('\nWill not commit directly to master line; merge in from github from a feature branch-s\n')
    process.exit(1)
  }
}

module.exports = command
