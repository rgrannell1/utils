
const constants = require('./src/constants')
const reactions = require('./src/reactions')

const {expect} = require('chai')
const neodoc = require('neodoc')
const EventEmitter = require('events')

/**
 * Run a task by name, and provide state-updates to an event-emitter to display
 *   updates
 *
 * @private
 *
 * @param  {string}     command the name of the command that is being run.
 * @param  {Boolean}    options.passArgs should args be passed to the task?
 * @param  {Object}     options.tasks an object of task-name:task pairs
 * @param  {[type]}     options.emitter an event-emitter that can be used to provide
 *   progress updates
 *
 * @return {Promise} a result promise
 */
async function runTask (command, {passArgs = true}, state) {
  const {tasks, emitter} = state
  const taskData = tasks[command]

  if (!taskData) {
    const joinedDependencies = Object.keys(tasks).map(term => `  - ${term}`).join('\n')
    throw new Error(`"${command}" not in list of available tasks:\n${joinedDependencies}`)
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
 * Add a named task to pulp. If this name is provided to pulp by the CLI then this task
 *   will be executed with additional command-line arguments & an event-emitter for reporting
 *   status. An array of dependencies will be run before this task.
 *
 * @name pulp.add(...)
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
methods.add = function () {
  var name
  var dependencies
  var cli
  var task

  const [state, ...rest] = arguments

  if (rest.length === 1) {
    // eslint-disable-next-line
    var {name, dependencies, cli, task} = rest[0]
  } else if (rest.length === 2) {
    [name, task] = rest
  } else if (rest.length === 3) {
    [name, dependencies, task] = rest
  } else if (rest.length === 4) {
    [name, dependencies, cli, task] = rest
  } else {
    throw new Error(`can't destruct supplied arguments; "${rest.length}" arguments supplied`)
  }

  expect(name).to.be.a('string', 'task name missing or invalid')

  if (!task) {
    task = () => {}
  }

  if (!dependencies) {
    dependencies = []
  }

  state.tasks[name] = {name, cli, dependencies, task}

  return {
    add: methods.add.bind(null, state),
    addAll: methods.addAll.bind(null, state),
    run: methods.run.bind(null, state),
    state
  }
}

/**
 * Add a dictionary of tasks to pulp. This method delegates to .add(), and is a convenience method
 *   to allow an entire CLI be defined in one command.
 *
 * @name pulp.addAll(...)
 *
 * @public
 *
 * @param {Object} tasks an object of command-name : task pairs
 */
methods.addAll = function (state, tasks) {
  for (const name of Object.keys(tasks)) {
    methods.add(state, tasks[name])
  }
}

/**
 * Run the pulp task specified in the command-line arguments. When this command
 *   is executed pulp will look read the CLI arguments for to find the command specified, and
 *   will pass the remaining command-line arguments to the named-task selected.
 *
 * @name pulp.addAll(...).run()
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

  const eventState = {

  }

  state.emitter.on(constants.events.depStart, reactions.depStart.bind(null, eventState))
  state.emitter.on(constants.events.depOk, reactions.depOk.bind(null, eventState))
  state.emitter.on(constants.events.depErr, reactions.depErr.bind(null, eventState))

  state.emitter.on(constants.events.taskStart, reactions.taskStart.bind(null, eventState))
  state.emitter.on(constants.events.taskOk, reactions.taskOk.bind(null, eventState))
  state.emitter.on(constants.events.taskErr, reactions.taskErr.bind(null, eventState))

  state.emitter.on(constants.events.subTaskProgress, reactions.subTaskProgress)

  return {
    add: methods.add.bind(null, state),
    addAll: methods.addAll.bind(null, state),
    run: methods.run.bind(null, state),
    state
  }
}

module.exports = pulp
