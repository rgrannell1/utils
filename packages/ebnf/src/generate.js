
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

/**
 * [* description]
 *
 * @yield {[type]} [description]
 */
generate[constants.types.grammar] = function* () {

}
/**
 * Yield from each subexpression provided as value
 *
 * @yield {Array} an array of yielded subterms
 */
generate[constants.types.and] = function* ({value}, bindings) {
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
generate[constants.types.excluding] = function* ({value}) {

}
/**
 * [* description]
 *
 * @yield {[type]} [description]
 */
generate[constants.types.group] = function* () {

}
/**
 * [* description]
 *
 * @yield {[type]} [description]
 */
generate[constants.types.literal] = function* (term) {
  yield term
}
/**
 * [* description]
 *
 * @yield {[type]} [description]
 */
generate[constants.types.or] = function* ({value}, bindings) {
  for (let subterm of value) {
    yield* ruleGenerator(asType(subterm), bindings)
  }
}
/**
 * [* description]
 *
 * @yield {[type]} [description]
 */
generate[constants.types.ref] = function* ({value}, bindings) {
  expect(bindings).to.be.an('object')
  expect(bindings).to.have.property(value)

  yield* bindings[value]();
}

function* zip (iter0, iter1) {
  for (elem0 of iter0) {
    for (let elem1 of iter1) {
      yield [elem0].concat(elem1)
    }
  }
}

function* cycle (gen) {
  while (true)
}

function* crossProduct ([iter0, iter1, ...rest]) {


}

/**
 * Repeately yield results from a generator
 *
 * @yield {Array}
 */
generate[constants.types.repeat] = function* ({value}, bindings) {
  const iter = () => ruleGenerator(asType(value), bindings)

  let repeats = 0

  while (true) {
    let generators = array.seqTo(repeats).map(iter)

    yield* crossProduct()

    repeats++
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
