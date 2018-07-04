
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
  let flags = ''
  if (args['--candidate']) {
    flags += ` --canary`
  }

  return execa.shell(`echo y | node_modules/.bin/lerna publish ${flags}`)
    .stdout.pipe(process.stdout)
}

module.exports = command
