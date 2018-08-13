
const YAML = require('yamljs')
const util = require('util')
const {expect} = require('chai')

const reporters = {}

/**
 * Create a TAP report for a test-run.
 *
 * @param  {Array<Object>} results An array of test-results
 * @param  {Object} opts           Various options
 *
 * @return {undefined}
 */
reporters.tap = (results, opts) => {
  let summaries = []

  expect(results).to.be.an('array')

  // eslint-disable-next-line no-unused-expressions
  expect(results).to.not.be.empty
  expect(opts).to.be.an('object')

  for (const result of results) {
    if (result.type === 'theory-result-set') {
      expect(result.hypotheses).to.be.an('array')
      expect(result.theory).to.be.a('string')
      expect(result.results).to.be.an('array')

      summaries = summaries.concat(reporters.tap.theory(result))
    } else {
      throw new Error(`type ${result.type} not currently supported.`)
    }
  }

  if (summaries.length === 0) {
    throw new Error('no test results to report')
  }

  let message = 'TAP version 13'
  message += `\n1..${summaries.length}\n`

  summaries.forEach((summary, count) => {
    const state = summary.state === 'passed' ? 'ok' : 'not ok'
    message += `${state} ${count + 1} ${summary.hypothesis}\n`
    message += '   ---\n'
    message += YAML.stringify(summary)
      .split('\n')
      .map(line => `  ${line}`)
      .join('\n')

    message += '   ...\n'
  })

  console.log(message)

  if (summaries.some(summary => summary.state !== 'passed')) {
    process.exit(1)
  }
}

reporters.tap.theory = ({hypotheses, theory, results}) => {
  let theorySummaries = []

  expect(hypotheses).to.be.an('array')
  expect(theory).to.be.a('string')
  expect(results).to.be.an('array')

  if (results.length === 0) {
    throw new Error(`no results present for theory "${theory}"`)
  }

  for (const result of results) {
    if (result.type === 'hypothesis-result-set') {
      theorySummaries = theorySummaries.concat(reporters.tap.hypothesis(theory, result))
    } else {
      throw new Error(`type ${result.type} not currently supported.`)
    }
  }

  return theorySummaries
}

reporters.tap.hypothesis = (theory, result) => {
  const summaries = []

  expect(result).to.be.an('object')
  expect(result.results).to.be.an('array')

  for (const hypothesisResult of result.results) {
    const summary = {
      theory,
      testCase: util.inspect(hypothesisResult.testCase, {depth: 10}),
      state: hypothesisResult.state,
      hypothesis: hypothesisResult.hypothesis
    }

    if (hypothesisResult.error) {
      summary.error = hypothesisResult.error
    }

    if (hypothesisResult.error) {
      summary.error = hypothesisResult.error
    }

    summaries.push(summary)
  }
  return summaries
}

module.exports = reporters
