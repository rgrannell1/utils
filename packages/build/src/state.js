
const fs = require('fs').promises
const stateModule = {}

const methods = {}

methods.store = (state, opts) => {
  const defaultOpts = Object.assign({
    depth: 2
  }, opts)

  const string = JSON.stringify(state.data, null, defaultOpts.depth)
  return fs.writeFile(state.path, string)
}

stateModule.create = fpath => {
  const data = {}

  return {
    data,
    store: methods.store({path: fpath, data})
  }
}

module.exports = stateModule
