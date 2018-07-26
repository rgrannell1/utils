
const chain = require('@rgrannell/chain')
const models = require('./src/models')
const reporters = require('./src/reporters')

const testing = {}

const methods = {
  hypotheses: {},
  theory: {}
}

/**
 *
 * @name  hypotheses.cases
 *
 * Declare test-cases for a particular hypothesis
 *
 * @param  {GeneratorFunction} gen    a function yielding test-cases
 * @return {Object}                   an object with the following methods:
 *   - always()
 */
methods.hypotheses.cases = (state, gen) => {
  state.cases = gen
  return chain({
    always: methods.hypotheses.always
  }, state)
}

/**
 *
 * @name  hypotheses.always
 *
 * Declare test-cases for a particular hypothesis
 *
 * @param  {function} condition a function returning true or false
 * @return {Object}            an object with the following methods:
 *   - always()
 *   - run()
 */
methods.hypotheses.always = (state, condition) => {
  state.conditions.push(condition)
  return chain({
    always: methods.hypotheses.always,
    run: methods.hypotheses.run
  }, state)
}

/**
 *
 * @name  hypotheses.run
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
 * Create a hypothesis object
 *
 * @param  {string} hypothesis    a description of the hypothesis
 * @return {Object}               an object with the method:
 *   - cases()
 */
testing.hypotheses = hypothesis => {
  return chain({
    cases: methods.hypotheses.cases
  }, {
    conditions: [],
    hypothesis
  })
}

/**
 * @name theory.given
 *
 * Add a single hypotheses to a theory
 *
 * @param  {Object} hypothesis    a hypothesis object.
 * @return {Object} an object with several methods:
 *   - given()
 *   - givenAll()
 *   - run()
 *
 */
methods.theory.given = (state, hypothesis) => {
  state.hypotheses.push(hypothesis)

  return chain({
    given: methods.theory.given,
    givenAll: methods.theory.givenAll,
    run: methods.theory.run
  }, state)
}

/**
 * @name theory.givenAll
 *
 * Add multiple hypotheses to a theory
 *
 * @param  {Object} hypotheses    an object of name - hypothesis mappings.
 * @return {Object}               an object with several methods:
 *   - given()
 *   - givenAll()
 *   - run()
 *
 */
methods.theory.givenAll = (state, hypotheses) => {
  for (const name of Object.keys(hypotheses)) {
    const hypothesis = hypotheses[name]
    state.hypotheses.push(hypothesis)
  }

  return chain({
    given: methods.theory.given,
    givenAll: methods.theory.givenAll,
    run: methods.theory.run
  }, state)
}

/**
 * @name theory.run
 *
 * @param  {string} options.report    should the report be displayed?
 * @return {theoryResultSet}          returns a data-model
 *
 */
methods.theory.run = async (state, opts = {}) => {
  const results = await Promise.all(state.hypotheses.map(hypothesis => {
    return hypothesis.run()
  }))

  const data = models.theoryResultSet(state, results)

  if (opts.report) {
    reporters.tap(results, opts)
  }

  return data
}

/**
 * @name testing.theory
 *
 * @param  {string} options.description    the description of the hypothesis being tested.
 * @return {Object}                        returns an object with several methods:
 *   - .run()
 *   - .given()
 *   - .givenAll()
 */
testing.theory = ({description}) => {
  return chain({
    run: methods.theory.run,
    given: methods.theory.given,
    givenAll: methods.theory.givenAll
  }, {
    description,
    hypotheses: []
  })
}

module.exports = testing
