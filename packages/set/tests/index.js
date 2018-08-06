
const index = require('@rgrannell/index')
const testing = require('@rgrannell/testing')

const theories = index.load({
  source: __dirname,
  excludes: ['runner']
})

module.exports = testing.theory({description: 'Set module works as expected'})
  .givenAll(theories)
