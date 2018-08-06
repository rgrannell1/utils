
const testing = require('../index')
const {expect} = require('chai')
const sinon = require('sinon')

const testCases = {}
const assertions = {}

assertions.isValidHypothesisSuccess = (assertionSpy, results) => {
  expect(assertionSpy.callCount).to.equal(1, 'test not called.')
  expect(assertionSpy.callCount).to.equal(1, 'test not called.')
  expect(results.hypothesis).to.be.a('string')
  expect(results.conditions).to.be.an('array')
  expect(results.results).to.be.an('array')
  expect(results.type).to.equal('hypothesis-result-set')
}

assertions.isValidHypothesisFailure = (assertionSpy, results) => {
  expect(assertionSpy.callCount).to.equal(1, 'test not called.')
  expect(results.hypothesis).to.be.a('string')
  expect(results.conditions).to.be.an('array')
  expect(results.results).to.be.an('array')
  expect(results.type).to.equal('hypothesis-result-set')
}

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

  const assertionSpy = sinon.spy(assertion)

  const results = await testing.hypothesis('testing.hypothesis')
    .cases(generator)
    .always(assertionSpy)
    .run()

  assertions.isValidHypothesisSuccess(assertionSpy, results)
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

  const assertionSpy = sinon.spy(assertion)

  const results = testing.hypothesis('testing.hypothesis')
    .cases(generator)
    .always(assertionSpy)
    .run()

  assertions.isValidHypothesisFailure(assertionSpy, results)
}

module.exports = testCases
