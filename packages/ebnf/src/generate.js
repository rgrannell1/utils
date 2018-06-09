
const {expect} = require('chai')
const ebnf = require('../index')
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
 * [* description]
 *
 * @yield {[type]} [description]
 */
generate[types.and] = function* ({value}) {
  let result = ''

  for (let subterm in value) {
    result += yield* foo(subterm)
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
  for (let subterm of value) {
    yield* foo(asType(subterm))
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

  if (type === 'rules') {

    term.rules.forEach(rule => {
      bindings[rule.id] = foo.bind(null, rule.value)
    })

    for (let aaa of bindings.digit()) {
      console.log(aaa)
    }

  } else if (type === 'or') {
    yield* generate[types.or](term)
  } else if (type === 'literal') {
    yield term.value
  } else {
    throw new Error(`unknown type "${type}"`)
  }
}

module.exports = foo