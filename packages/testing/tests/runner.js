
const {hypothesis} = require('./hypothesis')
const {theory} = require('./theory')

const testCases = {}

testCases.hypothesis = hypothesis
testCases.theory = theory

async function main () {
  await testCases.hypothesis()
  await testCases.theory()
}

main()
