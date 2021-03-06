
const fs = require('fs').promises
const execa = require('execa')
const branch = require('git-branch')
const inquirer = require('inquirer')
const github = require('@rgrannell/github')
const constants = require('../../constants')

module.exports = async () => {
  const prompt = inquirer.createPromptModule()

  const branches = {
    head: await branch(constants.paths.root),
    base: 'master'
  }

  const {head} = await prompt({
    type: 'input',
    name: 'head',
    message: `Feature branch [default: ${branches.head}]:`
  })

  if (head) {
    branches.head = head
  }

  const {base} = await prompt({
    type: 'input',
    name: 'base',
    message: `Base branch [default: ${branches.base}]:`
  })

  if (base) {
    branches.base = base
  }

  const {confirmation} = await prompt({
    type: 'confirm',
    name: 'confirmation',
    message: `Do you want to merge ${branches.head} into ${branches.base}`
  })

  if (!confirmation) {
    return
  }

  const {stdout} = await execa.shell(`git diff "${branches.head}" "${branches.base}" --stat`)
  const template = await fs.readFile(constants.paths.templates.pullRequest)
  const message = [
    template,
    '\n\n',
    '## Diff Summary',
    '```',
    stdout,
    '```',
    '\n\n'
  ].join('\n')

  const {body} = await prompt({
    type: 'editor',
    name: 'body',
    message: `Enter a commit message:`,
    default: message
  })

  const {prMessageConfirmation} = await prompt({
    type: 'confirm',
    name: 'prMessageConfirmation',
    message: `Are you happy with the following PR message?\n\n${body}\n\n`
  })

  if (!prMessageConfirmation) {
    return
  }

  return github.createPR({
    owner: 'rgrannell1',
    repo: 'utils',
    branches,
    message: body
  })
}
