
const errors =  {}
let code = 0

errors.create = config => {
  errors[config.name] = class extends Error {
    constructor (...args) {
      super(...args)

      if (config.code) {
        this.code = (config.code++)
      } else {
        this.code = code++
      }

      Object.defineProperties(this, {
        name: {
          enumerable: false,
          value: config.name
        },
        code: {
          enumerable: false,
          value: `${config.prefix}${('' + this.code).padStart(4, '0')}`
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

errors.create({name: 'SystemError', prefix: 'ERR'})

console.log(new errors.SystemError('this is an error'))
console.log(new errors.SystemError('this is an error'))
console.log(new errors.SystemError('this is an error'))
console.log(new errors.SystemError('this is an error'))
console.log(new errors.SystemError('this is an error'))
console.log(new errors.SystemError('this is an error'))
