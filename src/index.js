
const exported = [
  'array',
  'digitalOcean',
  'docker',
  'object',
  'fs'
]

for (let val of exported) {
  module.exports[val] = require(`./${val}`)
}
