
const inquirer = require('inquirer')

const command = {
  name: 'edit',
  dependencies: []
}

command.cli = `
Usage:
  script edit

Description:
  Manage the utils repository interactively
`

const commands = {
  'Create a Project': require('./edit/create-project'),
  'Create a PR': require('./edit/create-pr'),
  'Exit CLI' () {}
}

command.task = async args => {
  const prompt = inquirer.createPromptModule()

  const {command} = await prompt({
    type: 'list',
    name: 'command',
    message: 'Select a command',
    choices: Object.keys(commands)
  })

  await commands[command]()
}

module.exports = command
