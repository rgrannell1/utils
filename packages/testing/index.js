
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

function summarise ({passed, failed}) {
  const out = {passed, failed}
  const stats = {
    totalCases: passed.length + failed.length,
    counts: {
      passed: passed.length,
      failed: failed.length
    }
  }

  stats.pct = {
    passed: stats.counts.passed / stats.totalCases,
    failed: stats.counts.failed / stats.totalCases
  }

  return Object.assign(out, {stats})
}

methods.hypotheses.run = state => {
  const results = {
    passed: [],
    failed: []
  }

  if (!state.conditions || state.conditions.length === 0) {
    throw new Error('missing conditions')
  }

  for (const tcase of state.cases()) {
    for (const pred of state.conditions) {
      try {
        const asExpected = pred.apply(null, tcase)
        if (!asExpected) {
          results.failed.push({pred, tcase})
        } else {
          results.passed.push({pred, tcase})
        }
      } catch (err) {
        results.failed.push({pred, tcase, err})
      }
    }
  }

  return summarise(results)
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

  const stats = {
    totalHypotheses: results.length,
    counts: {
      failed: results.reduce((sum, hypothesis) => sum + hypothesis.stats.counts.failed === 0 ? 0 : 1, 0),
      passed: results.reduce((sum, hypothesis) => sum + hypothesis.stats.counts.passed === 0 ? 0 : 1, 0)
    }
  }

  return {
    hypotheses: results,
    stats
  }
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
