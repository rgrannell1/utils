
const execa = require('execa')

const command = {
  name: 'lerna-publish',
  dependencies: ['lint']
}

command.cli = `
Usage:
  script lerna-publish
`

command.task = async args => {
  return execa.shell('echo y | node_modules/.bin/lerna publish --canary')
    .stdout.pipe(process.stdout)
}

module.exports = command
