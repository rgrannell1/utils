
const execa = require('execa')

const command = {
  name: 'lerna-bootstrap',
  dependencies: ['assert-valid-packages', 'lint', 'install-deps', 'depcheck', 'document']
}

command.cli = `
Usage:
  script lerna-bootstrap

Description:
  Bootstrap lerna packages.
`

command.task = async args => {
  let flags = []

  const cmd = execa(`node_modules/.bin/lerna`, ['bootstrap'].concat(flags))
  cmd.stdout.pipe(process.stdout)
  cmd.stderr.pipe(process.stderr)
}

module.exports = command
