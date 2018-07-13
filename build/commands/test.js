
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

command.task = async args => { }

module.exports = command
