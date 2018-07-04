
const promise = {}

/**
 *
 ~
 * @param {function} the function to call post stall
 * @param {number} the timeout in milliseconds
 *
 * Wait for a set time-period before resolving
 *
 * @returns {promise}
 *
 */
promise.stall = (fn, duration = 0) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(fn())
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
promise.timeout = (error, duration = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(error)
    }, duration)
  })
}

/**
 *
 * @param {function} fn a sync or async function.
 * @param {number} interval the polling interval.
 *
 * Wait until a sync or async function resolves.
 *
 * @returns {promise}
 *
 */
promise.waitUntil = (fn, interval = 0) => {
  const chain = Promise.resolve()

  try {
    if (fn() === true) {
      return Promise.resolve()
    } else {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(promise.waitUntil(fn))
        }, interval)
      })
    }
  } catch (err) {
    return Promise.reject(err)
  }
}

module.exports = promise
