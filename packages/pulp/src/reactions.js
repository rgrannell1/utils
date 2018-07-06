
const esp = require('error-stack-parser')
const assert = require('assert')
const {Signale} = require('signale')

const loggers = {}

loggers.task = new Signale({
  interactive: true,
  scope: 'task',
  types: {
    ok: {
      badge: '++',
      color: 'green',
      label: 'success'
    },
    err: {
      badge: '++',
      color: 'red',
      label: 'failure'
    },
    start: {
      badge: '▶',
      color: 'green',
      label: 'start'
    }
  }
})

loggers.task.config({
  displayTimestamp: true
})

loggers.deps = new Signale({
  interactive: true,
  scope: 'dependency',
  types: {
    ok: {
      badge: '✔',
      color: 'green',
      label: 'success'
    },
    err: {
      badge: '✖',
      color: 'red',
      label: 'failure'
    },
    start: {
      badge: '▶',
      color: 'green',
      label: 'start'
    }
  }
})

loggers.deps.config({
  displayTimestamp: true
})

const reactions = {}

reactions.depStart = data => {
  assert(data, 'missing depStart data argument')
  loggers.task.start(`Deferred to "${data.name}"`)
}

reactions.depOk = data => {
  assert(data, 'missing depOk data argument')
  loggers.task.ok(`Finished deferral to "${data.name}"`)
}

reactions.depErr = (name, err) => {
  assert(name, 'missing depErr name argument')
  loggers.deps.err(`Failed "${name}" with "${err}"\n${err.stack}`)
  process.exit(1)
}

reactions.taskStart = data => {
  assert(data, 'missing taskStart data argument')
  loggers.task.start(`Started "${data.name}"`)
}

reactions.taskOk = data => {
  assert(data, 'missing taskOk data argument')
  loggers.task.ok(`Finished task "${data.name}"`)
}

reactions.taskErr = (name, err) => {
  assert(name, 'missing depStart name argument')
  loggers.task.err(`Failed "${name}" with ${err}"\n${err.stack}`)
  process.exit(1)
}

module.exports = reactions
