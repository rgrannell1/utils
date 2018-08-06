
const setTests = require('./index')

setTests.run({report: true}).catch(err => {
  throw err
})
