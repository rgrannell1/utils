
const index = require('@rgrannell/index')
const testing = require('@rgrannell/testing')

const theories = index.load({source: __dirname})

module.exports = testing.theory({description: 'Set module works as expected'})
  .givenAll(theories)
