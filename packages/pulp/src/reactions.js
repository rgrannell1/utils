
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

loggers.subTask = new Signale({
  interactive: true,
  scope: 'task',
  types: {
    progress: {
      badge: '...',
      color: 'blue',
      label: 'progress'
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

reactions.depStart = (state, data) => {
  assert(data, 'missing depStart data argument')
  loggers.task.start(`Deferred to "${data.name}"`)
}

reactions.depOk = (state, data) => {
  assert(data, 'missing depOk data argument')
  loggers.task.ok(`Finished deferral to "${data.name}"`)
}

reactions.depErr = (name, err) => {
  assert(name, 'missing depErr name argument')
  loggers.deps.err(`Failed "${name}" with "${err}"\n${err.stack}`)
  process.exit(1)
}

reactions.taskStart = (state, data) => {
  state[data.name] = {
    time: new Date()
  }

  assert(data, 'missing taskStart data argument')
  loggers.task.start(`Started "${data.name}"`)
}

reactions.taskOk = (state, data) => {
  assert(data, 'missing taskOk data argument')

  const taskData = state[data.name]

  if (taskData) {
    const elapsed = new Date() - taskData.time
    loggers.task.ok(`Finished task "${data.name}" in ${elapsed}ms`)
  } else {
    loggers.task.ok(`Finished task "${data.name}"`)
  }
}

reactions.taskErr = (state, name, err) => {
  assert(name, 'missing depStart name argument')

  const taskData = state[name]

  if (taskData) {
    const elapsed = new Date() - taskData.time
    loggers.task.err(`Failed "${name}" with ${err}"\n${err.stack} after ${elapsed}ms`)
  } else {
    loggers.task.err(`Failed "${name}" with ${err}"\n${err.stack}`)
  }

  process.exit(1)
}

reactions.subTaskProgress = message => {
  loggers.subTask.progress(message)
}

module.exports = reactions
