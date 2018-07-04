
const standard = require('standard')
const chalk = require('chalk')

const command = {
  name: 'lint',
  dependencies: []
}

command.cli = `
Usage:
  script lint
`

const summariseLintErrors = results => {
  return results.results.map(result => {
    let message = `${chalk.inverse(result.filePath)}\n`

    message += result.messages.map(({ruleId, message, source, line, column}) => {
      const prefix = chalk.bold(`[${ruleId} ${line}:${column}]`)
      return `  ${prefix} ${chalk.white(message)}`
    }).join('\n')

    return message
  }).join('\n\n') + '\n\n'
}

command.task = () => {
  const target = process.cwd() + '/packages/**/*.js'

  return new Promise((resolve, reject) => {
    standard.lintFiles(target, {}, (err, res) => {
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
