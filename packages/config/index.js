
const fs = require('fs')
const path = require('path')
const merge = require('deepmerge')

/**
 * Merge default & environment-specific configuration. Accepts either an object or a function that takes
 * the default configuration.
 *
 * @param  {string} configPath           the path to environmental configuration
 * @param  {function} defaultConf        configuration to merge in to
 *
 * @return {object} the loaded configuration
 */
const yieldConfig = (configPath, defaultConf) => {
  const loaded = require(configPath)

  if (typeof loaded === 'object') {
    return loaded
  } else if (typeof loaded === 'function') {
    return loaded(defaultConf)
  } else {
    throw new Error('invalid configuration type provided.')
  }
}

/**
 * Load configuration based on an environmental variable.
 *
 * @param {string} environment an environment variable. Defaults to NODE_ENV
 * @param {Object} opts options passed to the config module.
 * @param {string} opts.root the root folder to search for configuration in. Defaults to `process.cwd`
 *
 * @example
 * config('development', { root: '../..' })
 *
 * @return {Object} environment configuration
 */
const config = (environment, opts) => {
  if (!environment) {
    environment = process.env.NODE_ENV || 'development'
  }

  const paths = {}
  paths.root = opts.root || process.cwd()
  paths.configDir = path.join(paths.root, 'config')
  paths.default = path.join(paths.configDir, 'default.js')
  paths.environment = path.join(paths.configDir, `${environment}.js`)

  if (!fs.existsSync(paths.configDir)) {
    throw new Error(`folder "${paths.configDir}" missing from directory ${paths.root}`)
  }

  let defaultConf = {}
  if (fs.existsSync(paths.default)) {
    defaultConf = yieldConfig(paths.default)
  }

  if (fs.existsSync(paths.environment)) {
    return merge(yieldConfig(paths.environment, defaultConf), defaultConf)
  }
}

module.exports = config
