
const errors =  {}
let codeCounter = 0

errors.create = config => {
  const code = config.hasOwnProperty('code')
    ? config.code
    : (codeCounter++)

  if (errors.hasOwnProperty(config.name)) {
    throw new Error(`${config.name} is already defined.`)
  }

  errors[config.name] = class extends Error {
    constructor (...args) {
      super(...args)

      Object.defineProperties(this, {
        name: {
          enumerable: false,
          value: config.name
        },
        code: {
          enumerable: false,
          value: `${config.prefix}${('' + code).padStart(4, '0')}`
        }
      })
      this.message = `${this.code}: ${this.message}`
    }
  }
}

errors.deprecate = (fn, message) => {
  var warned = false
  function deprecated () {
    if (!warned) {
      console.warn(message)
    }
  }

  return deprecated
}

module.exports = errors
