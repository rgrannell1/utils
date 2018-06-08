
const {expect} = require('chai')
const generate = {}

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
 * [* description]
 *
 * @yield {[type]} [description]
 */
generate[types.and] = function* ({value}) {
  let result = ''

  for (let subterm in value) {
    result += yield* ebnf.generate(subterm)
  }

  return result
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
generate[types.literal] = function* ({value}) {
  yield value
}
/**
 * [* description]
 *
 * @yield {[type]} [description]
 */
generate[types.or] = function* ({value}) {
  let subterm = array.oneOf(value)
  yield* ebnf.generate(subterm)
}
/**
 * [* description]
 *
 * @yield {[type]} [description]
 */
generate[types.ref] = function* () {

}
/**
 * [* description]
 *
 * @yield {[type]} [description]
 */
generate[types.repeat] = function* () {

}
/**
 * [* description]
 *
 * @yield {[type]} [description]
 */
generate[types.rule] = function * () {

}

const foo = function * (term) {
  const {type} = term

  let bindings = {}

  console.log(type)

  if (type === 'rules') {
    term.rules.forEach(function * (rule) {
      bindings[rule.id] = yield* foo(rule.value)
    })

  } else if (type === 'or') {
    yield* generate[types.or](term)
  } else {
    throw new Error(JSON.stringify(term, null, 2))
  }
}

module.exports = foo