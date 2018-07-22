
const chain = require('@rgrannell/chain')

const testing = {}

const methods = {
  hypotheses: {},
  theory: {}
}

methods.hypotheses.cases = (state, gen) => {
  state.cases = gen
  return chain({
    always: methods.hypotheses.always
  }, state)
}

methods.hypotheses.always = (state, pred) => {
  state.conditions.push(pred)
  return chain({
    always: methods.hypotheses.always,
    run: methods.hypotheses.run
  }, state)
}

const summarise = {}

summarise.hypotheses = results => {
  const output = {results}

  output.all = () => {
    return output.results
  }
  output.failed = () => {
    return output.results.filter(result => result.state === 'failed')
  }
  output.passed = () => {
    return output.results.filter(result => result.state === 'passed')
  }
  output.errored = () => {
    return output.results.filter(result => result.state === 'errored')
  }
  output.percentages = () => {
    return {
      results,
      status: output.failed().length > 0,
      pct: {
        failed: output.failed().length / output.all().length,
        passed: output.passed().length / output.all().length
      }
    }
  }

  return output
}

methods.hypotheses.run = state => {
  const results = []

  if (!state.conditions || state.conditions.length === 0) {
    throw new Error('missing conditions')
  }

  for (const tcase of state.cases()) {
    for (const pred of state.conditions) {
      try {
        const asExpected = pred.apply(null, tcase)
        if (!asExpected) {
          results.push({pred, tcase, hypothesis: state.hypothesis, state: 'failed'})
        } else {
          results.push({pred, tcase, hypothesis: state.hypothesis, state: 'passed'})
        }
      } catch (err) {
        results.push({pred, tcase, err, hypothesis: state.hypothesis, state: 'errored'})
      }
    }
  }

  return summarise.hypotheses(results)
}

testing.hypotheses = hypothesis => {
  return chain({
    cases: methods.hypotheses.cases
  }, {
    conditions: [],
    hypothesis
  })
}

methods.theory.given = (state, hypothesis) => {
  state.hypotheses.push(hypothesis)

  return chain({
    given: methods.theory.given,
    run: methods.theory.run
  }, state)
}

methods.theory.run = async (state, pred) => {
  const results = await Promise.all(state.hypotheses.map(hypothesis => {
    return hypothesis.run()
  }))

  const output = {
    results,
    state: results.some(({state}) => state === 'failed')
  }

  return output
}

testing.theory = opts => {
  return chain({
    run: methods.theory.run,
    given: methods.theory.given
  }, {
    hypotheses: []
  })
}

module.exports = testing
