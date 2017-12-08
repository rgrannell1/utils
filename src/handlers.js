
const handlers = {}

handlers.onExit = ( ) => {
  process.on('exit', code => {
    console.error(`exiting node with status ${code}`)
  })
}

module.exports = handlers
