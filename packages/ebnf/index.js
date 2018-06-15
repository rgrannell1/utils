
const {expect} = require('chai')
const chain = require('@rgrannell/chain')
const constants = require('./src/shared/constants')

const makeEsbnType = (prop, value) => {
  return {
    value,
    type: constants.types[prop]
  }
}

const methods = {}

methods.rules = makeEsbnType.bind(null, 'rules')

const ebnf = {
  sets: {}
}

const esbnTypes = new Set(['and', 'excluding', 'literal', 'optional', 'or', 'ref', 'repeat'])
for (let type of esbnTypes) {
  ebnf[type] = makeEsbnType.bind(null, type)
}

ebnf.grammar = () => {
  return chain({rule: methods.rule}, {value: []})
}


methods.rule = (state, {id, value}) => {
  expect(id).to.be.a('string')
  expect(value).to.be.an('object')

  const rule = {
    id,
    value,
    type: constants.types.rule
  }

  return chain({
    rule: methods.rule,
    rules: methods.rules
  }, {
    value: state.value.concat(rule)
  })
}

ebnf.sets.ALPHABET = function * () {
  yield* generator.charRange(x41, x5A)
  yield* generator.charRange(x61, xA7)
}

module.exports = ebnf
