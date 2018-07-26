
const YAML = require('yamljs')
const util = require('util')

const reporters = {}

reporters.tap = (results, opts) => {
  let message = ''
  let count = 0
  for (const result of results) {
    if (result.type === 'theory-result-set') {
      message += '\n' + reporters.tap.theory(result, count)
    }
  }

  const printeable = `TAP version 13\n1..${count}\n${message}`

  console.log(printeable)
}

reporters.tap.theory = ({hypotheses, theory, results}, count) => {
  let theoryMessage = ''

  for (const result of results) {
    for (const hyResult of result.results) {
      const summary = {
        theory,
        testCase: util.inspect(hyResult.testCase, {depth: 10})
      }

      let hypoMessage = `${hyResult.state} ${count++} ${hyResult.hypothesis}`
      hypoMessage += `\n  ---\n`
      hypoMessage += YAML.stringify(summary).split('\n').map(line => `  ${line}`).join('\n')
      hypoMessage += `\n  ...\n`

      theoryMessage += `\n${hypoMessage}`
    }
  }

  return theoryMessage
}

module.exports = reporters
