
const fs = require('./fs')
const pathModule = require('path')

const deps = {
  states: {}
}

deps.states.failed = (params, metadata, error) => {

}
deps.states.success = (params, metadata) => {

}
deps.states.skipped = (params, metadata) => {

}

module.exports = deps
