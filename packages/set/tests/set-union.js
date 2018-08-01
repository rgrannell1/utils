
const set = require('../index')
const testing = require('@rgrannell/testing')

const hypotheses = {}

hypotheses.setDiffEmpty = testing.hypothesis('set.union with an empty set adds no elements')
  .cases(function * () {
    yield [new Set([])]
    yield [new Set([1])]
    yield [new Set([{x: 1}])]
  })
  .always(set0 => {
    return set.equals(set.union(set0, new Set([])), set0)
  })

module.exports = testing.theory({description: 'Establish set.union works as expected for known test-cases'})
  .given(hypotheses.setDiffEmpty)
