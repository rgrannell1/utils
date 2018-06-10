
const {expect} = require('chai')
const ebnf = require('../index')
const constants = require('./shared/constants')
const generate = {}

const array = {
  oneOf (value) {
    return value[Math.floor(Math.random() * value.length)]
  }
}

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
generate[types.and] = function* ({value}) {
  let result = []

  // -- todo can this be tidied up?
  for (let subterm of value) {
    subvalue = ruleGenerator(asType(subterm)).next()
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
generate[types.or] = function* ({value}) {
  for (let subterm of value) {
    yield* ruleGenerator(asType(subterm))
  }
}
/**
 * [* description]
 *
 * @yield {[type]} [description]
 */
generate[types.ref] = function* () {

}
/**
 * Repeately yield from the term provided
 *
 * @yield {[type]} [description]
 */
generate[types.repeat] = function* ({value}) {
  for (let subterm of value) {
    yield* ruleGenerator(asType(subterm))
  }
}
/**
 * [* description]
 *
 * @yield {[type]} [description]
 */
generate[types.rule] = function * () {

}

const ruleGenerator = function * (term) {
  const {type} = term
  let bindings = {}

  if (generate.hasOwnProperty(type)) {
    yield* generate[type](term)
  } else {
    throw new Error(`unknown type provided`)
  }
}

/**
 * Convert an EBNF grammar definition into a set of rules that can be used to
 *   generate sentences in that grammar.
 *
 * @param  {Object} rules [description]
 *
 * @return {Object} an object of `id:generator` mappings, where
 *                    each generator yields sentences within that ids definition.
 */
const generator = rules => {
  const {type} = rules
  let bindings = {}

  if (type === 'rules') {

    rules.rules.forEach(rule => {
      bindings[rule.id] = ruleGenerator.bind(null, rule.value)
    })

    return bindings

  } else {
    throw new Error(`unknown type "${type}"`)
  }
}



module.exports = generator