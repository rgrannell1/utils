
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
  let data = {}

  try {
    data = JSON.stringify(fs.readFile(fpath))
  } catch (err) {}

  return {
    data,
    store: methods.store.bind(null, {path: fpath, data})
  }
}

module.exports = stateModule
