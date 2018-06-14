
const generate = require('./src/generate')
const ebnf = require('./index')

let grammar = ebnf.grammar()
  .rule({
    id: 'letter',
    value: ebnf.or(ebnf.LETTERS)
  })
  .rule({
    id: 'string',
    value: ebnf.and([
      ebnf.literal('"'),
      ebnf.repeat(ebnf.ref('letter')),
      ebnf.literal('"'),
    ])
  })
  .rules()



const generator = generate(grammar)

// return rules definitions?

for (let aaa of generator.string()) {
  console.log('--------')
  console.log(aaa)
  console.log('++++++++')
}

