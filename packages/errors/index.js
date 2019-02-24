
const util = require('util')

const state = {}

const CustomError = function (name, message, code, stackFrame) {
  Error.captureStackTrace(this, stackFrame)
  this.name = name
  this.message = message
  this.code = code

  return this
}

util.inherits(CustomError, Error)

/**
 * Easily construct custom-errors
 *
 * @name  errors
 *
 * @example
 *   errors.notFoundError('user-account was not found', 'ENOTFOUND')
 */
const errors = new Proxy(state, {
  get: function stackFrame (_, prop) {
    return function (message, code) {
      return new CustomError(prop, `${code}: ${message}`, code, stackFrame)
    }
  }
})

module.exports = errors
