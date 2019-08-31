
const execa = require('execa')

const command = {
  name: 'lerna-publish',
//  dependencies: ['assert-valid-packages', 'lint', 'install-deps', 'depcheck', 'document']
}

command.cli = `
Usage:
  script lerna-publish

Description:
  Use lerna to deploy each submodule to deploy each submodule to NPM.
`

command.task = async args => {
  let flags = []

  const {stdout, stderr} = await execa(`node_modules/.bin/lerna`, ['publish', '--cd-version minor', '--yes'].concat(flags))


  console.log(stdout)
  console.error(stderr)
}

module.exports = command
