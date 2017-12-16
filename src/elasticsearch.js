/**
 * @module utils/elasticsearch
 *
 * @description
 *
 * Trello API wrapper
 *
 */

const request = require('request-promise-native')

/**
 * @param {string} method the HTTP method to use
 * @param {string} path the trello API uri-path
 * @param {object} credentials trello credentials
 * @param {object} credentials.key trello key
 * @param {object} credentials.token trello token
 * @param {object} params query-parameters
 *
 * @returns {Promise}
 */
const makeRequest = async (method, host, path, params = {}) => {
  return request[method]({
    uri: `${host}/${path}`,
    json: true,
    qs: Object.assign({}, params)
  })
}

const rest = {
  get: makeRequest.bind(null, 'get'),
  put: makeRequest.bind(null, 'put'),
  post: makeRequest.bind(null, 'post')
}

const elasticsearch = {}

elasticsearch.health = {}

class Elasticsearch {
  constructor (config) {
    Object.assign(this, config)
  }
  health () {
    return rest.get(this.host,  '_cluster/health')
  }
}

module.exports = Elasticsearch
