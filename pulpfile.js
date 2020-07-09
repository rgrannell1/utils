#!/usr/bin/env nodejs

const pulp = require('@rgrannell/pulp')

pulp.wrap('./build/commands').catch(err => {
  console.log(err)
  process.exit(1)
})
