
const constants = require('./shared/constants')

const esp = require('error-stack-parser')
const chalk = require('chalk')
const neodoc = require('neodoc')
const moment = require('moment')
const EventEmitter = require('events')

async function runTask (command, {tasks, emitter}) {
  const taskData = tasks[command]
  if (!taskData) {
    throw new Error(`"${command}" not in ${Object.keys(tasks)}`)
  }

  for (const subtask of taskData.dependencies) {
    emitter.emit(constants.events.depStart, tasks[subtask])

    try {
      await runTask(subtask, {tasks, emitter})
      emitter.emit(constants.events.depOk, tasks[subtask])
    } catch (depErr) {
      emitter.emit(constants.events.depErr, subtask, depErr)
    }
  }

  try {
    emitter.emit(constants.events.taskStart, taskData)
    await taskData.task(taskData.cli ? neodoc.run(taskData.cli) : undefined)
    emitter.emit(constants.events.taskOk, taskData)

  } catch (err) {
    emitter.emit(constants.events.taskErr, command, err)
  }
}

const getStack = err => {
  const [stack] = esp.parse(err)

  return `(${stack.fileName}:${stack.lineNumber})`
}

const reporters = message => {
  const dateBlock = chalk.white(moment().format('hh:mm:ss'))
  const output = `[${dateBlock}] ${message}`

  console.log(output)
}

const reactions = {}

reactions.depStart = ({name}) => {
  reporters(chalk.cyan(`Deferred to "${name}"`))
}

reactions.depOk = ({name}) => {
  reporters(chalk.green(`Finished deferral to "${name}"`))
}

reactions.depErr = (name, err) => {
  reporters(chalk.red(`Failed "${name}" with "${err}" `) + chalk.white(getStack(err)))
}

reactions.taskStart = ({name}) => {
  reporters(chalk.cyan(`Started "${name}"`))
}

reactions.taskOk = ({name}) => {
  reporters(chalk.green(`Finished task "${name}"`))
}

reactions.taskErr = (name, err) => {
  reporters(chalk.red(`Failed "${name}" with ${err}" `) + chalk.white(getStack(err)))
}

const pulp = {}

/**
 * Create a new task-list
 *
 * @return {Object} an object with a pair of methods; `add` and `run`
 */
pulp.tasks = () => {
  const state = {
    tasks: {},
    emitter: new EventEmitter()
  }

  state.emitter.on(constants.events.depStart, reactions.depStart)
  state.emitter.on(constants.events.depOk, reactions.depOk)
  state.emitter.on(constants.events.depErr, reactions.depErr)

  state.emitter.on(constants.events.taskStart, reactions.taskStart)
  state.emitter.on(constants.events.taskOk, reactions.taskOk)
  state.emitter.on(constants.events.taskErr, reactions.taskErr)

  return {
    async add () {
      if (arguments.length === 2) {
        var [name, task] = arguments
      } else if (arguments.length === 3) {
        var [name, dependencies, task] = arguments
      } else if (arguments.length === 4) {
        var [name, dependencies, cli, task] = arguments
      }

      state.tasks[name] = {name, cli, dependencies, task}
    },
    async run (opts) {
      const args = neodoc.run(`Usage: script <command>`, {allowUnknown: true})
      return runTask(args['<command>'], state)
        .catch(err => process.exit(1))
    }
  }
}

module.exports = pulp
