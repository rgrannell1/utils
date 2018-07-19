
const set = require('../index')
const tape = require('tape')

const tests = {}

tests.equals = {}
tests.equals.equal = {
  description: '#set.equals (equal cases)',
  data: [
    [new Set([]), new Set([])],
    [new Set([1]), new Set([1])]
  ]
}

tests.equals.unequal = {
  description: '#set.equals (unequal cases)',
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
