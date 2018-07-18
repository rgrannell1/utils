
const fs = require('fs').promises
const path = require('path')
const constants = require('../constants')
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

const commands = {}

commands['Create a Project'] = require('./edit/createProject')
commands['Exit CLI'] = () => {}

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
