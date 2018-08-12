
const pulp = require('../index.js')
const testing = require('@rgrannell/testing')

const hypotheses = {}
const cases = {}

hypotheses.pulpTasks = testing.hypothesis('pulp.tasks() works as expected')
  .cases(function * () {
    yield []
  })
  .always(() => {
    const {add, addAll, run, state} = pulp.tasks()
    return typeof add === 'function' &&
      typeof addAll === 'function' &&
      typeof run === 'function' &&
      typeof state === 'object'
  })

cases.pulpAdd = function * () {
  yield [{
    name: 'test',
    dependencies: []
  }]
}

hypotheses.pulpAdd = testing.hypothesis('pulp.tasks().add works as expected')
  .cases(cases.pulpAdd)
  .always(args => {
    const tasks = pulp.tasks()
    tasks.add(args)

    const {add, addAll, run, state} = tasks

    return typeof add === 'function' &&
      typeof addAll === 'function' &&
      typeof run === 'function' &&
      typeof state === 'object'
  })

module.exports = testing.theory({description: 'Establish pulp works as expected for known test-cases'})
  .given(hypotheses.pulpTasks)
  .given(hypotheses.pulpAdd)
