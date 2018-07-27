
const YAML = require('yamljs')
const util = require('util')

const reporters = {}

reporters.tap = (results, opts) => {
  let summaries = []

  for (const result of results) {
    if (result.type === 'theory-result-set') {
      summaries = summaries.concat(reporters.tap.theory(result))
    } else {
      throw new Error(`type ${result.type} not currently supported.`)
    }
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

reporters.tap.theory = ({hypothesis, theory, results}) => {
  let theorySummaries = []

  for (const result of results) {
    if (result.type === 'hypothesis-result-set') {
      theorySummaries = theorySummaries.concat(reporters.tap.hypothesis(theory, result))
    } else {
      throw new Error(`type ${result.type} not currently supported.`)
    }
  }

  return theorySummaries
}

reporters.tap.hypothesis = (theory, {results}) => {
  const summaries = []
  for (const hyResult of results) {
    summaries.push({
      theory,
      testCase: util.inspect(hyResult.testCase, {depth: 10}),
      state: hyResult.state,
      hypothesis: hyResult.hypothesis
    })
  }
  return summaries
}

module.exports = reporters
