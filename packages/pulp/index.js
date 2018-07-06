
const constants = require('./src/constants')
const reactions = require('./src/reactions')

const neodoc = require('neodoc')
const EventEmitter = require('events')

async function runTask (command, {passArgs = true}, {tasks, emitter}) {
  const taskData = tasks[command]

  if (!taskData) {
    throw new Error(`"${command}" not in ${Object.keys(tasks)}`)
  }

  for (const subtask of taskData.dependencies) {
    if (!tasks || !tasks[subtask]) {
      throw new Error(`missing task data for "${subtask}". Did you forget to bind it to your "pulpfile.js"?`)
    }
    emitter.emit(constants.events.depStart, tasks[subtask])

    try {
      await runTask(subtask, {passArgs: false}, {tasks, emitter})
      emitter.emit(constants.events.depOk, tasks[subtask])
    } catch (depErr) {
      emitter.emit(constants.events.depErr, subtask, depErr)
    }
  }

  try {
    emitter.emit(constants.events.taskStart, taskData)
    await taskData.task(taskData.cli && passArgs ? neodoc.run(taskData.cli) : undefined)
    emitter.emit(constants.events.taskOk, taskData)
  } catch (err) {
    emitter.emit(constants.events.taskErr, command, err)
  }
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
      var name
      var dependencies
      var cli
      var task

      if (arguments.length === 1) {
        if (typeof arguments !== 'object') {
          throw new Error('non-object provided')
        }
        // eslint-disable-next-line
        var {name, dependencies, cli, task} = arguments[0]
      } else if (arguments.length === 2) {
        [name, task] = arguments
      } else if (arguments.length === 3) {
        [name, dependencies, task] = arguments
      } else if (arguments.length === 4) {
        [name, dependencies, cli, task] = arguments
      } else {
        throw new Error("can't destruct supplied arguments")
      }

      state.tasks[name] = {name, cli, dependencies, task}
    },
    async run () {
      const args = neodoc.run(`Usage: script <command>`, {allowUnknown: true})
      return runTask(args['<command>'], {passArgs: true}, state)
    }
  }
}

module.exports = pulp
