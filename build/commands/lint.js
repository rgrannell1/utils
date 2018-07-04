
const {id} = require('@rgrannell/fp')
const standard = require('standard')
const chalk = require('chalk')
const path = require('path')

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

command.task = async () => {
  const target = path.join(process.cwd(), '/packages/**/*.js')

  const results = await new Promise((resolve, reject) => {
    standard.lintFiles(target, {fix: true}, (err, res) => {
      err ? reject(err) : resolve(res)
    })
  })

  if (results.errorCount > 0) {
    throw new Error(summariseLintErrors(results))
  }
}

module.exports = command
