
const errors =  {}
let codeCounter = 0

/**
 * @param {object} config
 * @param {object} config.name the name of the error-subclass
 * @param {object} config.prefix the prefix of each error-code
 * @param {object} config.code the number of the error code
 *
 * Create a new error subclass.
 *
 * @returns {undefined}
 */
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

/**
 * @param {function} fn the function to wrap
 * @param {string} message the message to display
 *
 * Create a new error subclass.
 *
 * @returns {function}
 */

errors.deprecate = (fn, message) => {
  var warned = false
  function deprecated (...args) {
    if (!warned) {
      console.warn(message)
    }
    fn(...args)
  }

  return deprecated
}

module.exports = errors
