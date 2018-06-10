
const generate = require('./src/generate')
const ebnf = require('./index')

let grammar = ebnf.grammar()
  .rule({
    id: 'number',
    value: ebnf.repeat(ebnf.ref('digit'))
  })
  .rule({
    id: 'digit',
    value: ebnf.or([0,1,2,3,4,5,6,7,8,9])
  })
  .rules()

const generator = generate(grammar)

// return rules definitions?

for (let aaa of generator.number()) {
  console.log('--------')
  console.log(aaa)
  console.log('++++++++')
}

