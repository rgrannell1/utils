
const ssllabs = require('node-ssllabs')

/**
 * @param {string} mathod the HTTP method to use
 * @param {string} path the ssl-labs API uri-path
 * @param {object} params query-parameters
 *
 * @returns {Promise}
 */
const makeRequest = async (method, path, params = {}) => {
  return JSON.parse(await request[method]({
    uri: `https://api.ssllabs.com/api/v2/${path}`,
    qs: Object.assign({}, params)
  }))
}

let rest = {
  get: makeRequest.bind(null, 'get')
}

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
