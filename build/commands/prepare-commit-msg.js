
const branch = require('git-branch')
const constants = require('../constants')

const command = {
  name: 'prepare-commit-msg',
  dependencies: ['lint', 'depcheck']
}

command.cli = `
Usage:
  script prepare-commit-msg <params>

Description:
  Run commit-message checks against this repository.
`

const assert = {}

command.task = async args => {
  console.log(args)
  console.log(args)
  console.log(args)
  console.log(args)
  console.log(args)
  console.log(args)
  console.log(args)
  console.log(args)
}

module.exports = command
