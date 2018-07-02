
const fs = require('fs')
const path = require('path')
const finder = require('find-package-json')

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

const config = (environment = process.env.NODE_ENV, opts) => {
  const {filename} = finder().next()
  const paths = {}

  paths.root = path.dirname(filename)
  paths.configDir = path.join(paths.root, 'config')
  paths.default = path.join(paths.configDir, 'default.js')
  paths.environment = path.join(paths.configDir, `${environment}.js`)

  if (!fs.existsSync(paths.configDir)) {
    throw new Error(`folder "${paths.configDir}" missing`)
  }

  let defaultConf
  if (!fs.existsSync(paths.default)) {
    defaultConf = yieldConfig(paths.default)
  }

  if (!fs.existsSync(paths.environment)) {
    return yieldConfig(paths.environment, defaultConf)
  }
}

module.exports = config
