
const state = {}

const CustomError = function (name, message, code, stackFrame) {
  Object.assign(this, {name, message, code})
  Error.captureStackTrace(this, stackFrame)
}

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
      return new CustomError(prop, message, code, stackFrame)
    }
  }
})

module.exports = errors
