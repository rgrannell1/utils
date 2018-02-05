
const exported = [
  'array',
  'dependencies',
  'digitalOcean',
  'docker',
  'elasticsearch',
  'google-cloud-storage',
  'object',
  'fs',
  'handlers',
  'httpResponses',
  'sslLabs'
]

for (let val of exported) {
  module.exports[val] = require(`./${val}`)
}
