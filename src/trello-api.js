/**
 * @module utils/trello-api
 *
 * @description
 *
 * Trello API wrapper
 *
 */

const request = require('request-promise-native')

const makeRequest = async (method, path, credentials, params = {}) => {
  if (!credentials.key) { throw new Error('no key provided.') }
  if (!credentials.token) { throw new Error('no token provided.') }
  if (path.indexOf('undefined') !== -1) { throw new Error('undefined detected') }
  if (path.indexOf('[object Object]') !== -1) { throw new Error('[object Object] detected') }

  return JSON.parse(await request[method]({
    uri: `https://api.trello.com/1/${path}`,
    qs: Object.assign({}, credentials, params)
  }))
}

let rest = {
  get: makeRequest.bind(null, 'get'),
  put: makeRequest.bind(null, 'put'),
  post: makeRequest.bind(null, 'post')
}

const trelloClient = credentials => {
  const methods = {}

  methods.getBoards = async (userId) => {
    return rest.get(`member/${userId}/boards`, credentials)
  }

  methods.getBoard = async (userId, boardName) => {
    return (await methods.getBoards(credentials, userId)).find(board => board.name === boardName)
  }

  methods.getBoardId = async (userId, boardName) => {
    const board = await methods.getBoard(userId, boardName)
    return board ? board.id : null
  }

  methods.getLabels = async (boardId) => {
    return rest.get(`boards/${boardId}/labels`)
  }

  methods.getLabel = async (boardId, labelName) => {
    return (await methods.getLabels(boardId)).find(label => label.name === labelName)
  }

  methods.getLabelId = async (userId, labelName) => {
    const label = await methods.getLabel(userId, labelName)
    return label ? label.id : null
  }

  methods.getLists = async (boardId) => {
    return rest.get(`boards/${boardId}/lists`)
  }

  methods.getList = async (boardId, listName) => {
    return (await methods.getLists(boardId)).find(list => list.name === listName)
  }

  methods.getListId = async (boardId, listName) => {
    const list = await methods.getlist(userId, listName)
    return list ? list.id : null
  }

  return methods
}

module.exports = trelloClient
