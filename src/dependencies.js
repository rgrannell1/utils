
const fs = require('fs')
const chalk = require('chalk')
const object = require('./object')
const request = require('request')

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
    Object.assertProperties(this, ['path', 'label'])

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
    Object.assertProperties(this, ['variable', 'label'])

    return new Promise((resolve, reject) => {
      const varExists = process.env.hasOwnProperty(this.variable)
      const ctx = {
        variable: this.variable,
        label: this.label,
      }

      const reason = varExists ? 'variable found.' : 'variable not found.'

      varExists
        ? resolve({status: reportState.passed, ctx, reason})
        : resolve({status: reportState.failed, ctx, reason})

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
    Object.assertProperties(this, ['name', 'label'])

    const ctx = {
      variable: this.variable
    }
    return digitalOcean.findVMs({name: this.name})
      .then(vm => {
        const ctx = {
          name: this.name,
          label: this.label
        }
        const reason = vm ? 'vm exists' : 'vm does not exist.'

        return vm
          ? {status: reportState.passed, ctx, reason}
          : {status: reportState.failed, ctx, reason}
      })
      .catch(err => {
        return {status: reportState.failed, ctx, reason: 'an error occurred'}
      })
  }
}

deps.HttpResponse = class extends Dependency {
  constructor (...args) {
    super(...args)
    Object.assign(this, {
      label: 'http-response'
    })
  }
  [symbols.inspect] () {
    Object.assertProperties(this, ['url', 'label'])

    const ctx = {
      url: this.url,
      label: this.label
    }

    const expectedCode = this.statusCode || 200

    return new Promise((resolve, reject) => {
      const opts = {
        uri: this.url,
        headers: {

        }
      }

      request(opts, (err, res, body) => {

        ctx.hasResponse = !!res
        ctx.responseCode = res ? res.statusCode : null

        const status = {ctx}

        if (err) {
          ctx.err = err
        }

        if (err || !res || res.statusCode !== expectedCode) {
          status.status = reportState.failed

          if (err) {
            status.reason = 'an error occurred'
          } else if (!res) {
            status.reason = 'no response received'
          } else if (res && res.statusCode !== expectedCode) {
            status.reason = 'invalid status-code received'
          }

          resolve(status)
        } else {
          status.status = reportState.passed
          status.reason = 'expected response code received'
          resolve(status)
        }
      })
    })
  }
}

module.exports = deps
