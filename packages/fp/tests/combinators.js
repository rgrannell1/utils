
const fp = require('../index')
const testing = require('@rgrannell/testing')

const hypotheses = {}

hypotheses.id = testing.hypothesis('fp.id returns the supplied value')
  .cases(function * () {
    yield [0]
    yield [1]
    yield ['']
    yield ['a']
  })
  .always(val => {
    return fp.id(val) === val
  })

hypotheses.constant = testing.hypothesis('fp.constant returns a function returning the supplied value')
  .cases(function * () {
    yield [0]
    yield [1]
    yield ['']
    yield ['a']
  })
  .always(val => {
    return fp.constant(val)() === val
  })

hypotheses.pluck = testing.hypothesis('fp.pluck selects a property from an object')
  .cases(function * () {
    yield [{prop: 'value'}]
  })
  .always(val => {
    return fp.pluck('prop')(val) === val.prop
  })

module.exports = testing.theory({description: 'Establish fp combinators work correctly'})
  .givenAll(hypotheses)
