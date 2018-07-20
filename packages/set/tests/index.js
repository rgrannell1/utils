
const set = require('../index')
const testing = require('@rgrannell/testing')

testing.hypotheses('set.equals always returns true for equal sets')
  .cases(function * () {
    yield [new Set([])]
    yield [new Set([1])]
    yield [new Set([{x: 1}])]
  })
  .always(set0 => {
    return set.equals(set0, set0)
  })
  .run()

/*

const tests = {
  equals: {},
  union: {},
  intersection: {}
}

tests.equals.equal = {
  description: '#set.equals (equal sets)',
  data: [
    [new Set([]), new Set([])],
    [new Set([1]), new Set([1])]
  ]
}

tests.equals.unequal = {
  description: '#set.equals (unequal sets)',
  data: [
    [new Set([]), new Set([1])],
    [new Set([1]), new Set([])],
    [new Set([1, 2]), new Set([2, 3])]
  ]
}

tape.test(tests.equals.equal.description, assert => {
  for (const [set0, set1] of tests.equals.equal.data) {
    assert.true(set.equals(set0, set1))
  }

  assert.end()
})

tape.test(tests.equals.unequal.description, assert => {
  for (const [set0, set1] of tests.equals.unequal.data) {
    assert.false(set.equals(set0, set1))
  }

  assert.end()
})

 */
