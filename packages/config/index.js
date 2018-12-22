
const fs = require('fs')
const path = require('path')
const merge = require('deepmerge')

/**
 * Load configuration from the suppplied file-path, and merge in default configuration. Configuration
 * can either be provided as an exported object or function. If a function is exported, the default
 * configuration is provided to the environment function.
 *
 * @param  {string} configPath           the path to environmental configuration
 * @param  {function} defaultConf        configuration to merge in too
 *
 * @return {object}
 */
const yieldConfig = (configPath, defaultConf) => {
  const loaded = require(configPath)

  if (typeof loaded === 'object') {
    return loaded
  } else if (typeof loaded === 'function') {
    return loaded(defaultConf)
  } else {
    throw new Error('configuration was invalid')
  }
}

/**
 * Load configuration based on an 'environment' variable.
 *
 * @param  {string} environment an environment variable. Defaults to NODE_ENV when not supplied.
 * @param  {Object} opts an object containing optional arguments. Not currently used.

 * @return {Object} environment configuration
 */
const config = (environment, opts) => {
  if (!environment) {
    environment = process.env.NODE_ENV || 'development'
  }

  const paths = {}
  paths.root = process.cwd()
  paths.configDir = path.join(paths.root, 'config')
  paths.default = path.join(paths.configDir, 'default.js')
  paths.environment = path.join(paths.configDir, `${environment}.js`)

  if (!fs.existsSync(paths.configDir)) {
    throw new Error(`folder "${paths.configDir}" missing`)
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
