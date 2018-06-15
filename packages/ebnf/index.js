
const {expect} = require('chai')
const chain = require('@rgrannell/chain')
const constants = require('./src/shared/constants')
const generator = require('@rgrannell/generator')

const makeEsbnType = (prop, precond, value) => {
  let transformed = precond(value)
  return {
    value: transformed,
    type: constants.types[prop]
  }
}

const ebnf = {
  sets: {}
}

const transforms = {}

transforms.and = value => {
  return Array.from(value)
}
transforms.excluding = value => {
  return value
}
transforms.literal = value => {
  return value
}
transforms.optional = value => {
  return value
}
transforms.or = value => {
  return Array.from(value)
}
transforms.ref = value => {
  return value
}
transforms.repeat = value => {
  return value
}
transforms.rules = value => {
  return value
}

const methods = {}

methods.rules = makeEsbnType.bind(null, 'rules', transforms.rules)

const esbnTypes = new Set(['and', 'excluding', 'literal', 'optional', 'or', 'ref', 'repeat'])
for (let type of esbnTypes) {
  ebnf[type] = makeEsbnType.bind(null, type, transforms[type])
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
  yield* generator.charRange(0x41, 0x5A)
  yield* generator.charRange(0x61, 0x7A)
}

ebnf.sets.DIGITS = function * () {
  yield* generator.charRange(0x30, 0x39)
}

ebnf.sets.HEX_DIGITS = function * () {
  yield* ebnf.sets.DIGITS()
  yield* generator.charRange(0x41, 0x46)
}

ebnf.sets.DOUBLE_QUOTE = function * () {
  yield generator.charRange(0x22, 0x22)
}

ebnf.sets.SPACE = function * () {
  yield generator.charRange(0x20, 0x20)
}

ebnf.sets.ASCII = function * () {
  yield generator.charRange(0x01, 0x7F)
}

ebnf.sets.LINE_FEED = function * () {
  yield generator.charRange(0x0A, 0x0A)
}

module.exports = ebnf
