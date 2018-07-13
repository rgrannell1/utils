
const command = {
  name: 'depcheck',
  dependencies: []
}

command.cli = `
Usage:
  script depcheck

Description:
  Find unused dependencies
`

command.task = async args => {

}

module.exports = command
