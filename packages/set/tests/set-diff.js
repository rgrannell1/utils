
const set = require('../index')
const testing = require('@rgrannell/testing')

const hypotheses = {}

hypotheses.setDiffEmpty = testing.hypotheses('set.diff against against an empty set is the original set')
  .cases(function * () {
    yield [new Set([])]
    yield [new Set([1])]
    yield [new Set([{x: 1}])]
  })
  .always(set0 => {
    const diffed = set.diff(set0, new Set([]))
    return set.equals(diffed, set0)
  })

hypotheses.setDiffSelf = testing.hypotheses('set.diff against the same set is the empty set')
  .cases(function * () {
    yield [new Set([])]
    yield [new Set([1])]
    yield [new Set([{x: 1}])]
  })
  .always(set0 => {
    return set.equals(set.diff(set0, set0), new Set([]))
  })

module.exports = testing.theory({description: 'Establish set.diff works as expected for known test-cases'})
  .given(hypotheses.setDiffEmpty)
  .given(hypotheses.setDiffSelf)
