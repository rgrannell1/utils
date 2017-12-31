
const fs = require('fs')
const object = require('./object')

const reportState = {
  failed: Symbol('failed'),
  skipped: Symbol('skipped'),
  passed: Symbol('passed'),
  uncertain: Symbol('uncertain')
}
const symbols = {
  inspect: Symbol('inspect'),
  requiredFields: Symbol('requiredFields')
}

const deps = {}

class Dependency {
  constructor (config) {
    Object.assign(this, config)
  }
}

deps.check = async schemas => {

  const results = schemas.map(schema => {
    if (schema[symbols.inspect]) {
      return schema[symbols.inspect]()
    } else {
      throw new Error(`'inspect' method implemented.`)
    }
  })

  const resolvedResults = await Promise.all(results)

  const failed = resolvedResults.some(result => {
    result.status === reportState.failed
  })

  if (failed) {
    const message = ''
    const err = new Error(message)
    err.results = resolvedResults
    throw err
  } else {
    return
  }
}

deps.Path = class extends Dependency {
  [symbols.inspect] () {
    Object.assertProperties(this, ['path'])

    return new Promise((resolve, reject) => {
      fs.stat(this.path, err => {
        const ctx = {
          path: this.path
        }
        err
          ? resolve({status: reportState.failed, ctx})
          : resolve({status: reportState.passed, ctx})
      })
    })
  }
}

deps.EnvVar = class extends Dependency {
  [symbols.inspect] () {
    Object.assertProperties(this, ['variable'])

    return new Promise((resolve, reject) => {
      const ctx = {
        variable: this.variable
      }
      process.env.hasOwnProperty(this.variable)
        ? resolve({status: reportState.passed, ctx})
        : resolve({status: reportState.failed, ctx})

    })
  }
}

deps.Droplet = class extends Dependency {
  [symbols.inspect] () {
    Object.assertProperties(this, ['name'])

    return new Promise((resolve, reject) => {
      const ctx = {
        variable: this.variable
      }
      return digitalOcean.findVMs({name: this.name}).then(vm => {
        const ctx = {
          name: this.name
        }
        return vm
          ? {status: reportState.passed, ctx}
          : {status: reportState.failed, ctx}
      })
    })
  }
}
new deps.EnvVar({variable:'asdasd'})[symbols.inspect]()
module.exports = deps
