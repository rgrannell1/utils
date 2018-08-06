
const set = require('../index')
const testing = require('@rgrannell/testing')

const hypotheses = {}

hypotheses.setsEqual = testing.hypothesis('set.equals always returns true for equal sets')
  .cases(function * () {
    yield [new Set([])]
    yield [new Set([1])]
    yield [new Set([{x: 1}])]
  })
  .always(set0 => {
    return set.equals(set0, set0)
  })

hypotheses.setsNotEqual = testing.hypothesis('set.equals always returns false for unequal sets')
  .cases(function * () {
    yield [
      new Set([]),
      new Set([1])
    ]
    yield [
      new Set([1]),
      new Set([2])
    ]
    yield [
      new Set([{x: 1}]),
      new Set([{x: 2}])
    ]
    yield [
      new Set([1, 2]),
      new Set([2, 4])
    ]
  })
  .always((set0, set1) => {
    return !set.equals(set0, set1)
  })

module.exports = testing.theory({description: 'Establish the set module works as expected for known test-cases'})
  .given(hypotheses.setsEqual)
  .given(hypotheses.setsNotEqual)
