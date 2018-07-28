
const testing = require('../index')
const {expect} = require('chai')
const sinon = require('sinon')

const testCases = {}

testCases.hypothesis = async () => {
  await testCases.hypothesis.success()
  await testCases.hypothesis.failure()
}

testCases.hypothesis.success = async () => {
  console.log('testing.hypothesis.success')

  const generator = function * () {
    yield [1, 2, 3]
  }
  const assertion = (a, b, c) => {
    expect(a).to.equal(1)
    expect(b).to.equal(2)
    expect(c).to.equal(3)
  }

  const spy = sinon.spy(assertion)

  await testing.hypotheses('testing.hypothesis')
    .cases(generator)
    .always(spy)
    .run()

  expect(spy.callCount).to.equal(1, 'test not called.')
}

testCases.hypothesis.failure = async () => {
  console.log('testing.hypothesis.failure')

  const generator = function * () {
    yield [1, 2, 3]
  }
  const assertion = (a, b, c) => {
    expect(a).to.equal(1)
    expect(b).to.equal(2)
    expect(c).to.equal(3)
  }

  const spy = sinon.spy(assertion)

  const results = testing.hypotheses('testing.hypothesis')
    .cases(generator)
    .always(spy)
    .run()

  expect(spy.callCount).to.equal(1, 'test not called.')
  expect(results.hypothesis).to.be.a('string')
  expect(results.conditions).to.be.an('array')
  expect(results.results).to.be.an('array')
  expect(results.type).to.equal('hypothesis-result-set')

  console.log(Object.keys(results))
}

module.exports = testCases
