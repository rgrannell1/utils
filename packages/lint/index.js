
const chalk = require('chalk')
const standard = require('standard')

/**
 * Summarise lint-errors to display
 *
 * @param {*} results
 */
const summariseLintErrors = results => {
  let message = `${results.errorCount} errors encountered (${results.fixableErrorCount} autofixeable)\n`
  message = `${chalk.red(message)}`

  message += results.results.map(result => {
    let message = `${chalk.inverse(result.filePath)}\n`

    const isFine = result.messages.length === 0
    if (isFine) {
      return
    }

    message += result.messages.map(({ ruleId, message, source, line, column }) => {
      const prefix = chalk.red(`[${ruleId} ${line}:${column}]`)
      return `  ${prefix} ${chalk.white(message)}`
    }).join('\n')

    return message
  }).filter(x => x).join('\n\n') + '\n\n'

  return message
}

/**
 * lint files and throw an error if they do not pass
 *
 * @param {file} target the target glob
 */
const lint = async target => {
  if (!target) {
    throw new TypeError('no targets to lint')
  }
  const results = await new Promise((resolve, reject) => {
    standard.lintFiles(target, { fix: true }, (err, res) => {
      err ? reject(err) : resolve(res)
    })
  })

  if (results.errorCount > 0) {
    throw new Error(summariseLintErrors(results))
  }
}

module.exports = lint
