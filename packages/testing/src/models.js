
const models = {}

models.hypothesisResult = {}

models.hypothesisResult.failed = ({condition, testCase, hypothesis}) => {
  return {
    condition,
    testCase,
    hypothesis: hypothesis,
    state: 'failed'
  }
}

models.hypothesisResult.passed = ({condition, testCase, hypothesis}) => {
  return {
    condition,
    testCase,
    hypothesis: hypothesis,
    state: 'passed'
  }
}

models.hypothesisResult.errored = ({condition, testCase, hypothesis, error}) => {
  return {
    condition,
    testCase,
    error: error.toString(),
    hypothesis: hypothesis,
    state: 'errored'
  }
}

models.hypothesisResultSet = ({hypothesis, conditions}, results) => {
  const output = {
    hypothesis,
    conditions,
    results,
    type: 'hypothesis-result-set'
  }

  output.all = () => {
    return results
  }
  output.failed = () => {
    return results.filter(result => result.state === 'failed')
  }
  output.passed = () => {
    return results.filter(result => result.state === 'passed')
  }
  output.errored = () => {
    return results.filter(result => result.state === 'errored')
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
