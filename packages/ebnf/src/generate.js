
const chai = require('chai')
chai.config.useProxy = false

const array = require('@rgrannell/array')
const genUtils = require('@rgrannell/generator')
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

/**
 * [* description]
 *
 * @yield {[type]} [description]
 */
generate[constants.types.grammar] = function * () {

}
/**
 * Yield from each subexpression provided as value
 *
 * @yield {Array} an array of yielded subterms
 */
generate[constants.types.and] = function * ({value}, bindings) {
  const generators = value.map(subterm => () => ruleGenerator(subterm, bindings))
  yield * genUtils.crossProduct(generators)
}
/**
 * [* description]
 *
 * @yield {[type]} [description]
 */
generate[constants.types.optional] = function * ({value}) {
  yield
}

/**
 * [* description]
 *
 * @yield {[type]} [description]
 */
generate[constants.types.excluding] = function * ({value}) {

}

/**
 * Yield a literal value from a term
 *
 * @yield {any} A literal value
 */
generate[constants.types.literal] = function * (term) {
  yield term.value
}
/**
 * [* description]
 *
 * @yield {[type]} [description]
 */
generate[constants.types.or] = function * ({value}, bindings) {
  for (let subterm of value) {
    yield * ruleGenerator(asType(subterm), bindings)
  }
}
/**
 * Yield results from a named EBNF rule
 *
 * @yield {Any} values from a named EBNF
 */
generate[constants.types.ref] = function * ({value}, bindings) {
  yield * bindings[value]()
}

/**
 * Repeately yield results from a generator
 *
 * @yield {Array}
 */
generate[constants.types.repeat] = function * ({value}, bindings) {
  const iter = () => ruleGenerator(asType(value), bindings)

  for (let repeats of genUtils.increment()) {
    yield * genUtils.crossProduct(array.repeat(iter, repeats))
  }
}

/**
 * Yield iterables for each type of term provided
 *
 * @param {Object} term          [description]
 * @param {[type]} bindings      [description]
 *
 * @yield {[type]} [description]
 */
const ruleGenerator = function * (term, bindings) {
  const {type} = term

  if (generate.hasOwnProperty(type)) {
    yield * generate[type](term, bindings)
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
    rules.value.value.forEach(rule => {
      bindings[rule.id] = ruleGenerator.bind(null, rule.value, bindings)
    })

    return bindings
  } else {
    throw new Error(`unknown type "${type}"`)
  }
}

module.exports = generator
