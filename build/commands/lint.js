
const {id} = require('@rgrannell/fp')
const standard = require('standard')
const chalk = require('chalk')

const command = {
  name: 'lint',
  dependencies: []
}

command.cli = `
Usage:
  script lint
Description:
  lint and autofix package files
`

const summariseLintErrors = results => {
  let message = `${results.errorCount} errors encountered (${results.fixableErrorCount} autofixeable)\n`
  message = `${chalk.red(message)}`

  message += results.results.map(result => {
    let message = `${chalk.inverse(result.filePath)}\n`

    const isFine = result.messages.length === 0
    if (isFine) {
      return
    }

    message += result.messages.map(({ruleId, message, source, line, column}) => {
      const prefix = chalk.red(`[${ruleId} ${line}:${column}]`)
      return `  ${prefix} ${chalk.white(message)}`
    }).join('\n')

    return message
  }).filter(id).join('\n\n') + '\n\n'

  return message
}

command.task = () => {
  const target = process.cwd() + '/packages/**/*.js'

  return new Promise((resolve, reject) => {
    standard.lintFiles(target, {fix: true}, (err, res) => {
      err ? reject(err) : resolve(res)
    })
  }).then(results => {
    const failed = true
    if (failed) {
      throw new Error(summariseLintErrors(results))
    }
  })
}

module.exports = command
