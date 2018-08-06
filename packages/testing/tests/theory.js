
const testing = require('../index')
const {expect} = require('chai')

const testCases = {}
const assertions = {}

assertions.isValidTheoryObject = theory => {
  const methods = {
    run: Reflect.get(theory, 'run'),
    given: Reflect.get(theory, 'given'),
    givenAll: Reflect.get(theory, 'givenAll')
  }

  expect(methods.run).to.be.a('function', 'theory.run should be a function')
  expect(methods.given).to.be.a('function', 'theory.given should be a function')
  expect(methods.givenAll).to.be.a('function', 'theory.givenAll should be a function')
}

testCases.theory = () => {
  console.log('testing.theory')

  const theory = testing.theory({description: 'test_message'})

  assertions.isValidTheoryObject(theory)
}

module.exports = testCases
