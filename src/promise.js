
const promise = {}

/**
 *
 * @param {function} the function to call post stall
 * @param {number} the timeout in milliseconds
 *
 * Wait for a set time-period before resolving
 *
 * @returns {promise}
 *
 */
promise.stall = (fn, duration = 0) {
  return new Promise(resolve => {
    setTimeout(( ) => {
      resolve(fn( ))
    }, duration)
  })
}

/**
 *
 * @param {error} the error to throw
 * @param {number} the timeout in milliseconds
 *
 * Trello API wrapper
 *
 * @returns {promise}
 *
 */
promise.timeout = (error, duration = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(( ) => {
      reject(error)
    }, duration)
  })
}

module.exports = promise
