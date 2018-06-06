/**
 * @module utils/trello-api
 *
 * @description
 *
 * Trello API wrapper
 *
 */

const request = require('request-promise-native')

/**
 * @param {string} mathod the HTTP method to use
 * @param {string} path the trello API uri-path    * @param {object} credentials trello credentials
 * @param {object} credentials.key trello key
 * @param {object} credentials.token trello token
 * @param {object} params query-parameters
 *
 * @returns {Promise}
 */
const makeRequest = async (method, path, credentials, params = {}) => {
  return request[method]({
    uri: `https://api.trello.com/1/${path}`,
    json: true,
    qs: Object.assign({}, credentials, params)
  })
}

const rest = {
  get: makeRequest.bind(null, 'get'),
  put: makeRequest.bind(null, 'put'),
  post: makeRequest.bind(null, 'post')
}

const trelloClient = credentials => {
  const methods = {}
  /**
   * @param {string} userId
   *
   * @returns {Promise}
   */
  methods.getBoards = async (userId) => {
    return rest.get(`member/${userId}/boards`, credentials)
  }
  /**
   * @param {string} userId
   *
   * @returns {Promise}
   */
  methods.getBoard = async (userId, boardName) => {
    return (await methods.getBoards(credentials, userId)).find(board => board.name === boardName)
  }
  /**
   * @param {string} userId
   *
   * @returns {Promise}
   */
  methods.getBoardId = async (userId, boardName) => {
    const board = await methods.getBoard(userId, boardName)
    return board ? board.id : null
  }
  /**
   * @param {string} boardId
   *
   * @returns {Promise}
   */
  methods.getLabels = async (boardId) => {
    return rest.get(`boards/${boardId}/labels`)
  }
  /**
   * @param {string} boardId
   * @param {string} labelName
   *
   * @returns {Promise}
   */
  methods.getLabel = async (boardId, labelName) => {
    return (await methods.getLabels(boardId)).find(label => label.name === labelName)
  }
  /**
   * @param {string} userId
   * @param {string} labelName
   *
   * @returns {Promise}
   */
  methods.getLabelId = async (userId, labelName) => {
    const label = await methods.getLabel(userId, labelName)
    return label ? label.id : null
  }
  /**
   * @param {string} boardId
   *
   * @returns {Promise}
   */
  methods.getLists = async (boardId) => {
    return rest.get(`boards/${boardId}/lists`)
  }
  /**
   * @param {string} boardId
   * @param {string} listName
   *
   * @returns {Promise}
   */
  methods.getList = async (boardId, listName) => {
    return (await methods.getLists(boardId)).find(list => list.name === listName)
  }
  /**
   * @param {string} boardId
   * @param {string} listName
   *
   * @returns {Promise}
   */
  methods.getListId = async (boardId, listName) => {
    const list = await methods.getlist(userId, listName)
    return list ? list.id : null
  }

  return methods
}

module.exports = trelloClient
