
const promise = {}

promise.stall = (fn, duration = 0) {
  return new Promise(resolve => {
    setTimeout(( ) => {
      resolve(fn( ))
    }, duration)
  })
}

promise.timeout = (error, duration = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(( ) => {
      reject(error)
    }, duration)
  })
}

module.exports = promise
