
const ssllabs = require('node-ssllabs')

const sslLabsClient = () => {
  const methods = {}

  methods.scan = (host) => {
    return new Promise((resolve, reject) => {
      ssllabs.scan(host, (err, host) => {
        err ? reject(err) : resolve(host)
      })
    })
  }

  methods.summarise = async () => {
    const result = await methods.scan()
    const site = result.endpoints[0]

    return {
      ipAddress: site.ipAddress,
      grade: site.grade,
      hasWarnings: site.hasWarnings,
      isExceptional: site.isExceptional
    }
  }

  return methods
}

module.exports = sslLabsClient
