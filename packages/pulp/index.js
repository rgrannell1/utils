
const fs = require('fs').promises
const chalk = require('chalk')
const path = require('path')
const {expect} = require('chai')
const neodoc = require('neodoc')
const EventEmitter = require('events')

const constants = require('./src/constants')
const reactions = require('./src/reactions')

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
  expect(tasks).to.be.an('object')

  for (const name of Object.keys(tasks)) {
    const task = tasks[name]

    expect(task).to.be.an('object')
    expect(task).to.have.property('name')

    methods.add(state, task)
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
    .map(term => {
      const docs = state.tasks[term].cli.split('\n')
      let description = null
      for (let ith = 0; ith < docs.length - 1; ++ith) {
        let candidate = docs[ith].toLowerCase()

        if (candidate.startsWith('description')) {
          description = docs[ith + 1].replace(/^\s+/g, '').trim()
          break
        }
      }

      return description.length > 0
        ? ` - ${chalk.bold(term)}: ${description}...`
        : ` - ${chalk.bold(term)}`
    })
    .join('\n')

  let commandDescription

  if (Object.keys(state.tasks).length > 0) {
    commandDescription = [
      'Description:',
      '  Available commands:\n',
      commands
    ].join('\n')
  } else {
    commandDescription = [
      'Description:',
      '  No available commands:\n'
    ].join('\n')
  }

  const docs = [
    'Usage:',
    '  pulpfile.js <command>',
    '  pulpfile.js <command> (-h|--help)',
    '',
    commandDescription,
    '\n'
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

/**
 * Load commands from a target folder. These commands can either be fully
 * specified pulp sub-cli's, or simply a function export.
 *
 * @param {string} fpath the folder path to load from
 *
 * @returns {Object} an object of commands
 */
const loadCommands = async fpath => {
  // -- try load all commands from an index the person was nice enough to add
  try {
    return require(path.join(process.cwd(), fpath, 'index.js'))
  } catch (err) { }

  let stat
  try {
    stat = await fs.lstat(fpath)
  } catch (err) {
    console.log(err)
    throw new Error(`failed to check the inode type of ${fpath}`)
  }

  if (!stat.isDirectory(fpath)) {
    throw new Error(`${fpath} was not a directory`)
  }

  // -- no index present; manually emulate and return one
  const commands = {}

  for (const content of await fs.readdir(fpath)) {
    const commandPath = path.join(process.cwd(), fpath, content)
    try {
      commands[content] = require(commandPath)
    } catch (err) {
      throw new Error(`failed to load ${commandPath}`)
    }
  }

  return commands
}

/**
 * Set up pulp with a directory full of commands
 *
 * @param {string} fpath a file path. This can either point to index.js (commands will be loaded from here)
 *   or from a directory (each file will be loaded as a command under the file-name)
 *
 * @return Promise<> a result promise
 */
pulp.wrap = async fpath => {
  // list, require, build
  const commands = await loadCommands(fpath)

  const tasks = pulp.tasks()

  tasks.addAll(commands)
  return tasks.run()
}

module.exports = pulp
