
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

commands['Create a Project'] = async () => {
  const prompt = inquirer.createPromptModule()

  const {name} = await prompt({
    type: 'input',
    name: 'name',
    message: 'Project name:'
  })

  if (name.includes(' ') || name.includes(' ')) {
    console.error('Project name cannot contain whitespace')
    process.exit(1)
  }

  const {description} = await prompt({
    type: 'input',
    name: 'description',
    message: 'Project description:'
  })

  await fs.mkdir(path.join(constants.paths.packages, name))
  await Promise.all([
    fs.mkdir(path.join(constants.paths.packages, name, 'tests')),
    fs.mkdir(path.join(constants.paths.packages, name, 'src'))
  ])

  const promises = {}

  promises.index = fs.writeFile(path.join(constants.paths.packages, name, 'index.js'), 'module.exports = {}')
  promises.packageJson = fs.writeFile(path.join(constants.paths.packages, name, 'package.json'), JSON.stringify({
    name: `@rgrannell/${name}`,
    description,
    main: 'index.js',
    license: 'MIT',
    publishConfig: {
      access: 'public'
    },
    dependencies: {}
  }, null, 2))

  await Promise.all([promises.index, promises.packageJson])
}

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
