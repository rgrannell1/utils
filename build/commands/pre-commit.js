
const command = {
  name: 'pre-commit',
  dependencies: ['lint']
}

command.cli = `
Usage:
  script pre-commit

Description:
  Run precommit checks against this repository.
`

command.task = async args => { }

module.exports = command
