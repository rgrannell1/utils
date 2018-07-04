
const ebnf = require('@rgrannell/ebnf')

const jsGenerator = {}

const parsers = {}

parsers.array = function * (generator) {
  for (let array of generator()) {
    yield array
  }
}

jsGenerator.array = function * (elem) {
  const generator = ebnf.grammar()
    .rule({
      id: 'array',
      value: ebnf.and(
        ebnf.repeat(elem)
      )
    })

  yield * parsers.array(generator)
}

/**
 * Yield indices of a function,
 *
 * @param {number} length    the length of an array
 * @yield {number}           indices of the provided array
 */
jsGenerator.indices = function * (length) {
  for (let ith = 0; ith < length; ++ith) {
    yield ith
  }
}

for (const xx of jsGenerator.array(function * () { yield 'x' })) {
  console.log(xx)
}

module.exports = jsGenerator
