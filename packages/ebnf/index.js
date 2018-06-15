
const {expect} = require('chai')
const chain = require('@rgrannell/chain')
const constants = require('./src/shared/constants')
const generator = require('@rgrannell/generator')
const object = require('@rgrannell/object')
const fp = require('@rgrannell/fp')

/**
 * Constructs boilerplate for each EBNF type
 *
 * @param  {string} prop        the type to create
 * @param  {function} transform a validate / transform function
 * @param  {any} value          a value
 *
 * @return {Object}
 */
const makeEsbnType = (type, transform, value) => {
  let transformed = transform(value)
  return {
    value: transformed,
    type: constants.types[type]
  }
}

const ebnf = {
  sets: {}
}

const transforms = {
  excluding: fp.id,
  literal: fp.id,
  optional: fp.id,
  ref: fp.id,
  repeat: fp.id,
  rules: fp.id
}

transforms.and = value => {
  return Array.from(value)
}

transforms.or = value => {
  return Array.from(value)
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

  console.log(object.take(methods, ['rule', 'rules']))

  return chain(object.take(methods, ['rule', 'rules']), {
    value: state.value.concat(rule)
  })
}

/**
 * Lower & upper-case characters
 *
 * @yield {string}
 */
ebnf.sets.ALPHABET = function * () {
  yield* generator.charRange(0x41, 0x5A)
  yield* generator.charRange(0x61, 0x7A)
}

/**
 * Arabic digits
 *
 * @yield {string}
 */
ebnf.sets.DIGITS = function * () {
  yield* generator.charRange(0x30, 0x39)
}

/**
 * Hexidecimal characters
 *
 * @yield {string}
 */
ebnf.sets.HEX_DIGITS = function * () {
  yield* ebnf.sets.DIGITS()
  yield* generator.charRange(0x41, 0x46)
}

/**
 * A double-quote
 *
 * @yield {string}
 */
ebnf.sets.DOUBLE_QUOTE = function * () {
  yield generator.charRange(0x22, 0x22)
}

/**
 * A single-quote
 *
 * @yield {string}
 */
ebnf.sets.SINGLE_QUOTE = function * () {
  yield generator.charRange(0x22, 0x22)
}

/**
 * A space
 *
 * @yield {string}
 */
ebnf.sets.SPACE = function * () {
  yield generator.charRange(0x20, 0x20)
}

/**
 * ASCII characters
 *
 * @yield {string}
 */
ebnf.sets.ASCII = function * () {
  yield generator.charRange(0x01, 0x7F)
}

/**
 * A line-feed character
 *
 * @yield {string}
 */
ebnf.sets.LINE_FEED = function * () {
  yield generator.charRange(0x0A, 0x0A)
}

module.exports = ebnf
