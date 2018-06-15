
const generate = require('./src/generate')
const ebnf = require('./index')

let grammar = ebnf.grammar()
  .rule({
    id: 'letter',
    value: ebnf.or(ebnf.sets.HEX_DIGITS())
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

for (let sentence of generate(grammar).string()) {
  console.log(sentence.join(''))
}
