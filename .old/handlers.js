
const handlers = {}

handlers.onExit = code => {
  console.error(`exiting node with status ${code}`)
}

module.exports = handlers
