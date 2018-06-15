
const {expect} = require('chai')
const chain = require('@rgrannell/chain')
const constants = require('./src/shared/constants')

const methods = {}

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

const makeEsbnType = (prop, value) => {
  return {
    value,
    type: constants.types[prop]
  }
}

const ebnf = {}

const esbnTypes = new Set(['and', 'excluding', 'literal', 'optional', 'or', 'ref', 'repeat', 'rules'])
for (let type of esbnTypes) {
  ebnf[type] = makeEsbnType.bind(null, type)
}

ebnf.grammar = () => {
  return chain({rule: methods.rule}, {value: []})
}

ebnf.LETTERS = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']

module.exports = ebnf
