
const testing = require('../index')
const {hypothesis} = require('./hypothesis')
const {expect} = require('chai')

const testCases = {}

testCases.hypothesis = hypothesis

testCases.theory = () => {
  console.log('testing.theory')

  const theory = testing.theory({description: 'test_message'})
  const methods = {
    run: Reflect.get(theory, 'run'),
    given: Reflect.get(theory, 'given'),
    givenAll: Reflect.get(theory, 'givenAll')
  }

  expect(methods.run).to.be.a('function')
  expect(methods.given).to.be.a('function')
  expect(methods.givenAll).to.be.a('function')

  theory.given()
}

async function main () {
  await testCases.hypothesis()
  await testCases.theory()
}

main()
