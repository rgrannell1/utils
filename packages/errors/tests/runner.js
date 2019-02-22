
const pulpTests = require('./index')

pulpTests.run({report: true}).catch(err => {
  throw err
})
