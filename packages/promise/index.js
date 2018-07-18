
const promise = {}

/**
 *
 * Wait for a set time-period before resolving
 *
 * @param {function} the function to call post stall
 * @param {number} the timeout in milliseconds
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
 *  Trello API wrapper
 *
 * @name promise.timeout
 *
 * @param {error} the error to throw
 * @param {number} the timeout in milliseconds
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
 * Wait until a sync or async function resolves.
 *
 * @name promise.waitUntil
 *
 * @param {function} fn a sync or async function.
 * @param {number} interval the polling interval.
 *
 * @returns {promise}
 *
 */
promise.waitUntil = (fn, interval = 0) => {
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

/**
 * Run a series of asyncronous nullary functions sequentially
 *
 * @name promise.sequence
 *
 * @param  {Array<function>} tasks    a list of functions to run
 * @return {Promise<Array<any>>}      an array of values
 */
promise.sequence = async tasks => {
  const res = []

  for (const task of tasks) {
    res.push(await task())
  }

  return res
}

module.exports = promise
