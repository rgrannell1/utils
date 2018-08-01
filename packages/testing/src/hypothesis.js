
const {expect} = require('chai')
const chain = require('@rgrannell/chain')
const models = require('./models')

const testing = {}

const methods = {
  hypotheses: {},
  theory: {}
}

/**
 *
 * @name hypotheses.cases
 *
 * Declare test-cases for a particular hypothesis
 *
 * @param  {GeneratorFunction} generator    a function yielding test-cases
 * @return {Object}                   an object with the following methods:
 *   - always()
 */
methods.hypotheses.cases = (state, generator) => {
  expect(generator).to.be.a('function')

  state.cases = generator
  return chain({
    always: methods.hypotheses.always
  }, state)
}

/**
 *
 * @name hypotheses.always
 *
 * Declare test-cases for a particular hypothesis
 *
 * @param  {function} condition a function returning true or false
 * @return {Object}            an object with the following methods:
 *   - always()
 *   - run()
 */
methods.hypotheses.always = (state, condition) => {
  expect(condition).to.be.a('function')

  state.conditions.push(condition)
  return chain({
    always: methods.hypotheses.always,
    run: methods.hypotheses.run
  }, state)
}

/**
 *
 * @name hypotheses.run
 *
 * Test a hypothesis
 *
 * @return {HypothesisResultSet}    a description of the test-execution
 *
 *
 */
methods.hypotheses.run = state => {
  const results = []

  if (!state.conditions || state.conditions.length === 0) {
    throw new Error('missing conditions')
  }

  for (const testCase of state.cases()) {
    for (const condition of state.conditions) {
      const opts = {
        condition,
        testCase,
        hypothesis: state.hypothesis
      }

      try {
        const asExpected = condition.apply(null, testCase)
        if (!asExpected) {
          results.push(models.hypothesisResult.failed({...opts}))
        } else {
          results.push(models.hypothesisResult.passed({...opts}))
        }
      } catch (error) {
        results.push(models.hypothesisResult.errorer({...opts, error}))
      }
    }
  }

  return models.hypothesisResultSet(state, results)
}

/**
 * @name testing.hypothesis
 *
 * Create a hypothesis object
 *
 * @param  {string} hypothesis    a description of the hypothesis
 * @return {Object}               an object with the method:
 *   - cases()
 */
module.exports = hypothesis => {
  expect(hypothesis).to.be.an('string', '"hypothesis" must be an string')

  return chain({
    cases: methods.hypotheses.cases
  }, {
    conditions: [],
    hypothesis
  })
}
