1
const {expect} = require('chai')
const chain = require('@rgrannell/chain')

{
  var types = {}

  let esbnTypes = new Set([
    'and',
    'excluding',
    'group',
    'literal',
    'or',
    'ref',
    'repeat',
    'rule',
    'rules'
  ])

  for (let type of esbnTypes) {
    types[type] = type
  }
}

const methods = {}

methods.rule = ({rules}, {id, value}) => {
  expect(id).to.be.a('string')
  expect(value).to.be.an('object')

  const rule = {
    id,
    value,
    type: types.rule
  }

  return chain({
    rule: methods.rule,
    rules: methods.rules
  }, {
    rules: rules.concat(rule)
  })
}

methods.rules = ({rules}) => {
  return {
    rules,
    type: types.rules
  }
}

const ebnf = {}

ebnf.ref = value => {
  expect('value').to.be.a('string')
  expect('value').to.not.be.empty

  return {
    value,
    type: types.ref
  }
}

ebnf.grammar = () => {
  return chain({rule: methods.rule}, {rules: []})
}

ebnf.literal = value => {
  return {
    value,
    type: types.literal
  }
}

ebnf.or = value => {
  return {
    value,
    type: types.or
  }
}

ebnf.and = value => {
  return {
    value,
    type: types.and
  }
}

ebnf.excluding = value => {
  return {
    value,
    type: types.excluding
  }
}

ebnf.repeat = value => {
  return {
    value,
    type: types.repeat
  }
}

ebnf.group = value => {
  return {
    value,
    type: types.group
  }
}

module.exports = ebnf
