
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

for (let aaa of generate(grammar).string()) {
  console.log('--------')
  console.log(aaa)
  console.log('++++++++')
}
