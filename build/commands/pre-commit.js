
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
  console.log(process.env.GIT_PARAMS)
  console.log(process.env.GIT_PARAMS)
  console.log(process.env.GIT_PARAMS)
  console.log(process.env.GIT_PARAMS)
  console.log(process.env.GIT_PARAMS)
  console.log(process.env.GIT_PARAMS)
  console.log(process.env.GIT_PARAMS)
}

module.exports = command
