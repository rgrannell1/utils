
const {expect} = require('chai')
const chain = require('@rgrannell/chain')
const constants = require('./src/shared/constants')

const methods = {}

methods.rule = ({rules}, {id, value}) => {
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
    rules: rules.concat(rule)
  })
}

methods.rules = ({rules}) => {
  return {
    rules,
    type: constants.types.rules
  }
}

const ebnf = {}

ebnf.ref = value => {
  expect('value').to.be.a('string')
  expect('value').to.not.be.empty

  return {
    value,
    type: constants.types.ref
  }
}

ebnf.grammar = () => {
  return chain({rule: methods.rule}, {rules: []})
}

ebnf.literal = value => {
  return {
    value,
    type: constants.types.literal
  }
}

ebnf.or = value => {
  return {
    value,
    type: constants.types.or
  }
}

ebnf.and = value => {
  return {
    value,
    type: constants.types.and
  }
}

ebnf.optional = value => {
  return {
    value,
    type: constants.types.optional
  }
}

ebnf.excluding = value => {
  return {
    value,
    type: constants.types.excluding
  }
}

ebnf.repeat = value => {
  return {
    value,
    type: constants.types.repeat
  }
}

ebnf.group = value => {
  return {
    value,
    type: constants.types.group
  }
}

ebnf.LETTERS = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']

module.exports = ebnf
