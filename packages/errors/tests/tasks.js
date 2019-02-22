
const errors = require('../index.js')
const testing = require('@rgrannell/testing')

const hypotheses = {}
const cases = {}

cases.pulpTasks = function * () {
  yield [{
    name: 'HttpError',
    message: 'test message',
    code: 'ERR_001'
  }]
}

const setup = {}

setup.onError = fn => {
  return data => {
    try {
      throw errors[data.name](data.message, data.code)
    } catch (err) {
      return fn(err, data)
    }
  }
}

hypotheses.pulpTasks = testing.hypothesis('errors are constructed & displayed as expected')
  .cases(cases.pulpTasks)
  .always(setup.onError(err => err instanceof Error))
  .always(setup.onError((err, data) => err.message === `${data.code}: ${data.message}`))
  .always(setup.onError((err, data) => err.code === data.code))
  .always(setup.onError((err, data) => err.name === data.name))

module.exports = testing.theory({description: 'Error object module works as expected'})
  .given(hypotheses.pulpTasks)
