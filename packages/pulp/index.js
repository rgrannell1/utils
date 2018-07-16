
const constants = require('./src/constants')
const reactions = require('./src/reactions')

const neodoc = require('neodoc')
const EventEmitter = require('events')

async function runTask (command, {passArgs = true}, {tasks, emitter}) {
  const taskData = tasks[command]

  if (!taskData) {
    throw new Error(`"${command}" not in list of available tasks:\n${Object.keys(tasks).map(term => `  - ${term}`).join('\n')}`)
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
    await taskData.task(taskData.cli && passArgs ? neodoc.run(taskData.cli) : undefined, emitter)
    emitter.emit(constants.events.taskOk, taskData)
  } catch (err) {
    emitter.emit(constants.events.taskErr, command, err)
  }
}

const pulp = {
  events: constants.events
}

const methods = {}

/**
 * Add a task to pulp
 *
 * @public
 *
 * @param {string}         name the name of a task
 * @param {Array<string>}  dependencies an array of dependency task-names. These dependencies will be
 *   serially executed (as of this version) before finally executing the task itself.
 * @param {string}         cli an optional CLI specififying arguments consumed by this task.
 * @param {function}       task a binary function, taking args provided by the CLI and an emitter that
 *   can emit `pulp.events.subTaskProgress` to provide progress updates from the task
 */
methods.add = function (state) {
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
    throw new Error(`can't destruct supplied arguments; "${arguments.length}" arguments supplied`)
  }

  state.tasks[name] = {name, cli, dependencies, task}
}

/**
 * Add a dictionary of tasks to pulp
 *
 * @public
 *
 * @param {Object} tasks an object of command-name : task pairs
 */
methods.addAll = function (tasks) {
  for (const name of Object.keys(tasks)) {
    methods.add(tasks[name])
  }
}

/**
 * Run the pulp task specified in the command-line arguments.
 *
 * @public
 *
 * @return {Promise} a result promise
 */
methods.run = function (state) {
  const commands = Object.keys(state.tasks)
    .sort()
    .map(term => `    - ${term}`)
    .join('\n')

  const docs = [
    'Usage:',
    '  script <command>',
    '  script <command> (-h|--help)',
    '',
    'Description:',
    '  Available commands:',
    commands
  ].join('\n')

  const args = neodoc.run(docs, {allowUnknown: true})
  return runTask(args['<command>'], {passArgs: true}, state)
}

/**
 * Create a new task-list
 *
 * @return {Object} an object with three  methods; `add`, `addAll`, and `run`
 */
pulp.tasks = () => {
  const state = {
    tasks: {},
    emitter: new EventEmitter()
  }

  state.emitter.on(constants.events.depStart, reactions.depStart)
  state.emitter.on(constants.events.depOk, reactions.depOk)
  state.emitter.on(constants.events.depErr, reactions.depErr)
  state.emitter.on(constants.events.subTaskProgress, reactions.subTaskProgress)

  state.emitter.on(constants.events.taskStart, reactions.taskStart)
  state.emitter.on(constants.events.taskOk, reactions.taskOk)
  state.emitter.on(constants.events.taskErr, reactions.taskErr)

  return {
    add: methods.add.bind(null, state),
    addAll: methods.addAll.bind(null, state),
    run: methods.run.bind(null, state)
  }
}

module.exports = pulp
