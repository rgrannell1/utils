
const set = require('../index')
const testing = require('@rgrannell/testing')

const hypotheses = {}

hypotheses.setIntersectionEmptySet = testing.hypothesis('set.intersection with an empty set is empty set')
  .cases(function * () {
    yield [new Set([])]
    yield [new Set([1])]
    yield [new Set([{x: 1}])]
  })
  .always(set0 => {
    return set.intersection(set0, new Set([]))
  })

module.exports = testing.theory({description: 'Establish set.intersection works as expected for known test-cases'})
  .given(hypotheses.setIntersectionEmptySet)
