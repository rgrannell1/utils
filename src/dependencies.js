
const fs = require('fs')
const chalk = require('chalk')
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

const getPrefix = result => {
  if (result.status === reportState.failed) {
    return chalk.red('✖')
  }
  if (result.status === reportState.skipped) {
    return chalk.gray('→')
  }
  if (result.status === reportState.passed) {
    return chalk.green('✓')
  }
  if (result.status === reportState.uncertain) {
    return chalk.yellow('~')
  }
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
  const hasFailed = resolvedResults.some(result => {
    return result.status === reportState.failed
  })

  const report = '\n' + resolvedResults.map(result => {
    const subset = Object.remove(result.ctx, ['label'])
    return `${getPrefix(result)} ${result.ctx.label}: ${JSON.stringify(subset, null, 2)}`
  }).join('\n')

  if (hasFailed) {
    const err = new Error(report)
    err.results = resolvedResults
    throw err
  } else {
    return
  }
}

deps.Path = class extends Dependency {
  constructor (...args) {
    super(...args)
    Object.assign(this, {
      label: 'path'
    })
  }
  [symbols.inspect] () {
    Object.assertProperties(this, ['path'])

    return new Promise((resolve, reject) => {
      fs.stat(this.path, err => {
        const ctx = {
          path: this.path,
          label: this.label
        }
        err
          ? resolve({status: reportState.failed, ctx})
          : resolve({status: reportState.passed, ctx})
      })
    })
  }
}

deps.EnvVar = class extends Dependency {
  constructor (...args) {
    super(...args)
    Object.assign(this, {
      label: 'env-var'
    })
  }
  [symbols.inspect] () {
    Object.assertProperties(this, ['variable'])

    return new Promise((resolve, reject) => {
      const ctx = {
        variable: this.variable,
        label: this.label
      }
      process.env.hasOwnProperty(this.variable)
        ? resolve({status: reportState.passed, ctx})
        : resolve({status: reportState.failed, ctx})

    })
  }
}

deps.Droplet = class extends Dependency {
  constructor (...args) {
    super(...args)
    Object.assign(this, {
      label: 'droplet'
    })
  }
  [symbols.inspect] () {
    Object.assertProperties(this, ['name'])

    return new Promise((resolve, reject) => {
      const ctx = {
        variable: this.variable
      }
      return digitalOcean.findVMs({name: this.name}).then(vm => {
        const ctx = {
          name: this.name,
          label: this.label
        }
        return vm
          ? {status: reportState.passed, ctx}
          : {status: reportState.failed, ctx}
      })
    })
  }
}
deps.check([
  new deps.EnvVar({variable: 'xxxxxx'})
])
module.exports = deps
