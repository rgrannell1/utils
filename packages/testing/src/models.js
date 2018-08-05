
const {expect} = require('chai')

const models = {}

models.hypothesisResult = {}

/**
 * Validate & construct failed hypotheses results
 *
 * @param  {function} options.condition  a condition function
 * @param  {array} options.testCase      the arguments array used for this test-case
 * @param  {string} options.hypothesis   a description of the hypothesis
 *
 * @return {Object}
 */
models.hypothesisResult.failed = ({condition, testCase, hypothesis}) => {
  expect(condition).to.be.a('function')
  expect(testCase).to.be.an('array')
  expect(hypothesis).to.be.a('string')

  return {
    condition,
    testCase,
    hypothesis: hypothesis,
    state: 'failed'
  }
}

/**
 * Validate & construct passed hypotheses results
 *
 * @param  {function} options.condition  a condition function
 * @param  {array} options.testCase      the arguments array used for this test-case
 * @param  {string} options.hypothesis   a description of the hypothesis
 *
 * @return {Object}
 */
models.hypothesisResult.passed = ({condition, testCase, hypothesis}) => {
  expect(condition).to.be.a('function')
  expect(testCase).to.be.an('array')
  expect(hypothesis).to.be.a('string')

  return {
    condition,
    testCase,
    hypothesis: hypothesis,
    state: 'passed'
  }
}

/**
 * Validate & construct errored hypotheses results
 *
 * @param  {function} options.condition  a condition function
 * @param  {array} options.testCase      the arguments array used for this test-case
 * @param  {string} options.hypothesis   a description of the hypothesis
 * @param  {error} options.error         the error thrown by the test-case
 *
 * @return {Object}
 */
models.hypothesisResult.errored = ({condition, testCase, hypothesis, error}) => {
  expect(condition).to.be.a('function')
  expect(testCase).to.be.an('array')
  expect(hypothesis).to.be.a('string')
  expect(error).to.be.an('error')

  return {
    condition,
    testCase,
    error: error.toString(),
    hypothesis: hypothesis,
    state: 'errored'
  }
}

models.hypothesisResultSet = ({hypothesis, conditions}, results) => {
  expect(hypothesis).to.be.a('string')
  expect(conditions).to.be.an('array')
  expect(results).to.be.an('array')

  if (conditions.length === 0) {
    throw new Error(`no conditions provided for hypothesis "${hypothesis}"`)
  }

  if (results.length === 0) {
    throw new Error(`no results provided for hypothesis "${hypothesis}"`)
  }

  const output = {
    hypothesis,
    conditions,
    results,
    type: 'hypothesis-result-set'
  }

  /**
   * @name  hypothesisResultSet.all
   *
   * Return all hypothesis test-results
   *
   * @return {Array<HypothesisResult>} all test-results
   */
  output.all = () => {
    return results
  }
  /**
   * @name  hypothesisResultSet.failed
   *
   * Return failed hypothesis test-results
   *
   * @return {Array<HypothesisResult>} all test-results
   */
  output.failed = () => {
    return results.filter(result => result.state === 'failed')
  }
  /**
   * @name  hypothesisResultSet.passed
   *
   * Return passed test-results
   *
   * @return {Array<HypothesisResult>} passed test-results
   */
  output.passed = () => {
    return results.filter(result => result.state === 'passed')
  }
  /**
   * @name  hypothesisResultSet.passed
   *
   * Return error-throwing hypothesis test-results
   *
   * @return {Array<HypothesisResult>} error-throwing test-results
   */
  output.errored = () => {
    return results.filter(result => result.state === 'errored')
  }
  /**
   * @name  hypothesisResultSet.percentages
   *
   * Aggregate statistics describing the test-results.
   *
   * @return {Object} an object describing the test-results. Contains the fields:
   *   - results  the raw test-results
   *   - status
   *   - pct:
   *     - failed: the percentage of failed results
   *     - passed: the percentage of passed results
   *     - errored: the percentage of error-throwing results
   */
  output.percentages = () => {
    return {
      results,
      status: output.failed().length > 0,
      pct: {
        failed: output.failed().length / output.all().length,
        passed: output.passed().length / output.all().length,
        errored: output.errored().length / output.all().length
      }
    }
  }

  return output
}

models.theoryResultSet = ({hypotheses, description: theory}, results) => {
  const output = {
    hypotheses,
    theory,
    results,
    type: 'theory-result-set'
  }

  return output
}

module.exports = models
