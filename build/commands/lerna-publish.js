
const execa = require('execa')

const command = {
  name: 'lerna-publish',
  dependencies: ['lint', 'install-deps', 'depcheck', 'document']
}

command.cli = `
Usage:
  script lerna-publish

Description:
  Use lerna to deploy each submodule to deploy each submodule to NPM.
`

command.task = async args => {
  let flags = []

  const cmd = execa(`node_modules/.bin/lerna`, ['publish', '--canary', '--yes'].concat(flags))
  cmd.stdout.pipe(process.stdout)
  cmd.stderr.pipe(process.stderr)
}

module.exports = command
