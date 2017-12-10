
const exported = [
  'array',
  'digitalOcean',
  'docker',
  'object',
  'fs',
  'handlers',
  'ssl-labs'
]

for (let val of exported) {
  module.exports[val] = require(`./${val}`)
}
