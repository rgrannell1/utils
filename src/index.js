
const exported = [
  'array',
  'digitalOcean',
  'docker',
  'object',
  'fs',
  'handlers',
  'httpResponses',
  'sslLabs'
]

for (let val of exported) {
  module.exports[val] = require(`./${val}`)
}
