
const execa = require('execa')

const command = {
  name: 'lerna-publish',
  dependencies: ['lint']
}

command.cli = `
Usage:
  script lerna-publish [--candidate]

Options:
  --candidate    is the release a candidate or proper release?
`

command.task = async args => {
  let flags = []
  if (args['--candidate']) {
    flags.push('--canary')
  }

  const cmd = execa(`node_modules/.bin/lerna`, ['publish', '--cd-version major', '--yes'].concat(flags))
  cmd.stdout.pipe(process.stdout)
  cmd.stderr.pipe(process.stderr)
}

module.exports = command
