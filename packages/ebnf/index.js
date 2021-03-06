
const {expect} = require('chai')
const chain = require('@rgrannell/chain')
const constants = require('./src/shared/constants')
const generator = require('@rgrannell/generator')
const Obj = require('@rgrannell/object')
const fp = require('@rgrannell/fp')

/**
 * Constructs boilerplate for each EBNF type
 *
 * @name makeEsbnType
 *
 * @private
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

/**
 * Create an EBNF grammar
 *
 * @name ebnf.grammar
 *
 * @return {Object} chaining methods & state to create a EBNF ruleset
 */
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

  return chain(Object[Obj.take](methods, ['rule', 'rules']), {
    value: state.value.concat(rule)
  })
}

/**
 * Lower & upper-case characters
 *
 * @name ebnf.sets.ALPHABET
 *
 * @yield {string}
 */
ebnf.sets.ALPHABET = function * () {
  yield * generator.charRange(0x41, 0x5A)
  yield * generator.charRange(0x61, 0x7A)
}

/**
 * Arabic digits
 *
 * @name ebnf.sets.DIGITS
 *
 * @yield {string}
 */
ebnf.sets.DIGITS = function * () {
  yield * generator.charRange(0x30, 0x39)
}

/**
 * Hexidecimal characters
 *
 * @name ebnf.sets.HEX_DIGITS
 *
 * @yield {string}
 */
ebnf.sets.HEX_DIGITS = function * () {
  yield * ebnf.sets.DIGITS()
  yield * generator.charRange(0x41, 0x46)
}

/**
 * Binary bits
 *
 * @name ebnf.sets.BITS
 *
 * @yield {string}
 */
ebnf.sets.BITS = function * () {
  yield * generator.charRange(0x30, 0x31)
}

/**
 * A double-quote
 *
 * @name ebnf.sets.DOUBLE_QUOTE
 *
 * @yield {string}
 */
ebnf.sets.DOUBLE_QUOTE = function * () {
  yield generator.charRange(0x22, 0x22)
}

/**
 * A single-quote
 *
 * @name ebnf.sets.SINGLE_QUOTE
 *
 * @yield {string}
 */
ebnf.sets.SINGLE_QUOTE = function * () {
  yield generator.charRange(0x22, 0x22)
}

/**
 * A space
 *
 * @name ebnf.sets.SPACE
 *
 * @yield {string}
 */
ebnf.sets.SPACE = function * () {
  yield generator.charRange(0x20, 0x20)
}

/**
 * ASCII characters
 *
 * @name ebnf.sets.ASCII
 *
 * @yield {string}
 */
ebnf.sets.ASCII = function * () {
  yield generator.charRange(0x01, 0x7F)
}

/**
 * A line-feed character
 *
 * @name ebnf.sets.LINE_FEED
 *
 * @yield {string}
 */
ebnf.sets.LINE_FEED = function * () {
  yield generator.charRange(0x0A, 0x0A)
}

module.exports = ebnf
