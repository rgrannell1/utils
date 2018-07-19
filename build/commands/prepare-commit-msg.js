
const branch = require('git-branch')
const constants = require('../constants')

const command = {
  name: 'prepare-commit-msg',
  dependencies: ['lint', 'depcheck']
}

command.cli = `
Usage:
  script prepare-commit-msg [--params PARAMS]

Description:
  Run commit-message checks against this repository.

Options:
  --params PARAMS [env: GIT_PARAMS]
`

const assert = {}

command.task = async args => {
  console.log(process.env.GIT_PARAMS)
  console.log(process.env.GIT_PARAMS)
  console.log(process.env.GIT_PARAMS)
  console.log(process.env.GIT_PARAMS)
  console.log(process.env.GIT_PARAMS)
  console.log(process.env.GIT_PARAMS)
  console.log(process.env.GIT_PARAMS)
  console.log(process.env.GIT_PARAMS)
}

module.exports = command
