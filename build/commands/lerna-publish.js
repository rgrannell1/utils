
const execa = require('execa')

const command = {
  name: 'lerna-publish',
  dependencies: ['lint', 'document']
}

command.cli = `
Usage:
  script lerna-publish
`

command.task = async args => {
  let flags = []

  const cmd = execa(`node_modules/.bin/lerna`, ['publish', '--canary', '--yes'].concat(flags))
  cmd.stdout.pipe(process.stdout)
  cmd.stderr.pipe(process.stderr)
}

module.exports = command
