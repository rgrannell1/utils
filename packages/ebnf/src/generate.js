
const {expect} = require('chai')
const array = require('@rgrannell/array')
const ebnf = require('../index')
const constants = require('./shared/constants')
const generate = {}

/**
 * Cast literal values to a EBNF type
 *
 * @param {any} value an arbitrary value.
 *
 * @return {Object} an EBNF type
 */
const asType = value => {
  return value.type ? value : ebnf.literal(value)
}

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
    'rule'
  ])

  for (let type of esbnTypes) {
    types[type] = type
  }
}

/**
 * [* description]
 *
 * @yield {[type]} [description]
 */
generate[types.grammar] = function* () {

}
/**
 * Yield from each subexpression provided as value
 *
 * @yield {Array} an array of yielded subterms
 */
generate[types.and] = function* ({value}, bindings) {
  let result = []

  // -- todo can this be tidied up?
  for (let subterm of value) {
    subvalue = ruleGenerator(asType(subterm), bindings).next()
    result.push(subvalue.value)
  }

  yield result
}
/**
 * [* description]
 *
 * @yield {[type]} [description]
 */
generate[types.excluding] = function* ({value}) {

}
/**
 * [* description]
 *
 * @yield {[type]} [description]
 */
generate[types.group] = function* () {

}
/**
 * [* description]
 *
 * @yield {[type]} [description]
 */
generate[types.literal] = function* (term) {
  yield term
}
/**
 * [* description]
 *
 * @yield {[type]} [description]
 */
generate[types.or] = function* ({value}, bindings) {
  for (let subterm of value) {
    yield* ruleGenerator(asType(subterm), bindings)
  }
}
/**
 * [* description]
 *
 * @yield {[type]} [description]
 */
generate[types.ref] = function* ({value}, bindings) {
  expect(bindings).to.be.an('object')
  expect(bindings).to.have.property(value)

  yield* bindings[value]();
}
/**
 * Repeately yield results from a generator
 *
 * @yield {Array}
 */
generate[types.repeat] = function* ({value}, bindings) {
  let results = []

  // -- TODO does not work.

  for (let rep = 0; rep < 10; rep++) {
    let genny = ruleGenerator(asType(value), bindings)
    results.push(yield* genny)
    yield* results
  }
}

/**
 * [*ruleGenerator description]
 *
 * @param {[type]} term          [description]
 * @param {[type]} bindings      [description]
 *
 * @yield {[type]} [description]
 */
const ruleGenerator = function * (term, bindings) {
  const {type} = term

  if (generate.hasOwnProperty(type)) {
    yield* generate[type](term, bindings)
  } else {
    throw new Error(`unknown type provided`)
  }
}

/**
 * Convert an EBNF grammar definition into a set of rules that can be used to
 *   generate sentences in that grammar.
 *
 * @param  {Object} rules
 *
 * @return {Object} an object of `id:generator` mappings, where
 *                    each generator yields sentences within that ids definition.
 */
const generator = rules => {
  const {type} = rules
  let bindings = {}

  if (type === 'rules') {

    rules.rules.forEach(rule => {
      bindings[rule.id] = ruleGenerator.bind(null, rule.value, bindings)
    })

    return bindings

  } else {
    throw new Error(`unknown type "${type}"`)
  }
}

module.exports = generator
