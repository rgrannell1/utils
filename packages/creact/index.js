
const neodoc = require('neodoc')
const inquirer = require('inquirer')

const docs = {}

docs.main = `
Usage:
  node creact init
  node creact add component

Description:
`

const creact = {}

creact.init = async () => {
  const answers = await inquirer.prompt([
    {
      name: 'directory',
      message: 'Where do you want to create the site?',
      default: '.'
    },
    {
      name: 'project',
      message: 'What do you want to call the project?'
    },
    {
      name: 'action-choice',
      type: 'list',
      message: 'Action',
      choices: [
        'Create page',
        'Create component',
        'Quit'
      ]
    }
  ])

  console.log(JSON.stringify(answers))
}

const main = () => {
  const args = neodoc.run(docs.main, {allowUnknown: true})

  if (args.init) {
    creact.init()
  }
}

main()

module.exports = creact
