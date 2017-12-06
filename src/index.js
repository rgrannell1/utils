
const exported = [
  'array',
  'docker',
  'object'
]

for (let val of exported) {
  module.exports[val] = require(`./${val}`)
}
