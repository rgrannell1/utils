
const {expect} = require('chai')
const chain = require('@rgrannell/chain')
const generate = require('./src/generate')

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
  expect(value).to.be.a('string')
  expect(value).to.not.be.empty

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
  expect(value).to.be.an('array')

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

let grammar = ebnf.grammar()
  .rule({
    id: 'digit',
    value: ebnf.or(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'])
  })
  .rules()

const generator = generate(grammar)

for (let s of generator) {
  console.log(JSON.stringify(s))
}

module.exports = ebnf
