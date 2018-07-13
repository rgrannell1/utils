
const command = {
  name: 'pre-commit',
  dependencies: ['lint']
}

command.cli = `
Usage:
  script pre-commit
`

command.task = async args => { }

module.exports = command
