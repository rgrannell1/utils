
const exported = [
  'array',
  'digitalOcean',
  'docker',
  'elasticsearch',
  'object',
  'fs',
  'handlers',
  'httpResponses',
  'sslLabs'
]

for (let val of exported) {
  module.exports[val] = require(`./${val}`)
}
