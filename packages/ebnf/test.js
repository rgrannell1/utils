
const generate = require('./src/generate')
const ebnf = require('./index')

let grammar = ebnf.grammar()
  .rule({
    id: 'digit',
    value: ebnf.and(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'])
  })
  .rules()

const generator = generate(grammar)

for (let s of generator) {
  console.log(JSON.stringify(s))
}
