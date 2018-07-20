
const chain = require('@rgrannell/chain')

const testing = {}

const methods = {}

methods.cases = (state, gen) => {
  state.cases = gen
  return chain({
    always: methods.always
  }, state)
}

methods.always = (state, pred) => {
  state.conditions.push(pred)
  return chain({
    always: methods.always,
    run: methods.run
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

methods.run = state => {
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

testing.hypotheses = (...hypotheses) => {
  return chain({
    cases: methods.cases
  }, {
    conditions: [],
    hypotheses
  })
}

module.exports = testing
