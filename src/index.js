
const exported = [
  'array',
  'digital-ocean',
  'docker',
  'object',
  'fs'
]

for (let val of exported) {
  module.exports[val] = require(`./${val}`)
}
