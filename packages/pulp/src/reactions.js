
const esp = require('error-stack-parser')
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

reactions.depStart = ({name}) => {
  loggers.task.start(`Deferred to "${name}"`)
}

reactions.depOk = ({name}) => {
  loggers.task.ok(`Finished deferral to "${name}"`)
}

reactions.depErr = (name, err) => {
  loggers.deps.err(`Failed "${name}" with "${err}"\n${err.stack}`)
  process.exit(1)
}

reactions.taskStart = ({name}) => {
  loggers.task.start(`Started "${name}"`)
}

reactions.taskOk = ({name}) => {
  loggers.task.ok(`Finished task "${name}"`)
}

reactions.taskErr = (name, err) => {
  loggers.task.err(`Failed "${name}" with ${err}"\n${err.stack}`)
  process.exit(1)
}

module.exports = reactions
