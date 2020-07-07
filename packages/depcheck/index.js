
const chalk = require('chalk')
const depcheckModule = require('depcheck')

/**
 * run the dependency check module
 *
 * @param {string} fpath the path to the target directory
 *
 * @returns {Promise<object>} a promise containing dependency information
 */
const runDepcheck = fpath => {
  return new Promise((resolve, reject) => {
    depcheckModule(fpath, {}, response => {
      resolve(response)
    })
  })
}

/**
 * Throw an error if a package has any unused packages.
 *
 * @param {string} fpath the folder path containing the package.json
 *
 * @returns {Promise} a result promise
 */
const depcheck = async fpath => {
  if (!fpath) {
    throw new TypeError('no filepath provided')
  }

  const unused = await runDepcheck(fpath)

  if (unused.dependencies.length > 0) {
    let message = chalk.red(`\nproject has unused dependencies!\n\n`)

    message += unused.dependencies
      .map(name => `- ${name}`)
      .join('\n')

    message += '\n'
    throw new Error(message)
  }
}

module.exports = depcheck
