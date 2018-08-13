
const index = require('@rgrannell/index')
const testing = require('../../testing')

const theories = index.load({
  source: __dirname,
  excludes: ['runner']
})

module.exports = testing.theory({description: 'Pulp module works as expected'})
  .givenAll(theories)
