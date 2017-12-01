1
const fs = require('./fs')
const pathModule = require('path')

const deps = {
  states: {}
}

deps.states.failed = (params, error, metadata = {}) => {
  return {error, params, metadata}
}
deps.states.success = (params, metadata = {}) => {
  return {params, metadata}
}
deps.states.skipped = (params, metadata = {}) => {
  return {params, metadata}
}

deps.path = async ({path}) => {
  const exists = await fs.testFile(path)

  return exists
    ? deps.states.success({path})
    : deps.states.failed({path})

}

deps.envVar = envVar => {
  return typeof process.env.hasOwnProperty(envVar)
    ? deps.states.success({envVar})
    : deps.states.failed({envVar})
}

deps.check = results => {

}

module.exports = deps
