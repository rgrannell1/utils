
const jsGen = {}

jsGen.literal = function * (iter) {
  for (const value of iter) {
    yield {
      type: 'Literal',
      value
    }
  }
}

function * foo () {
  yield 1
  yield 2
  yield 3
}

for (const x of jsGen.literal(foo())) {
  console.log(x)
}

module.exports = jsGen
