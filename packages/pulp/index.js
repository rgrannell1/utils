
const neodoc = require('neodoc')

async function runTask (command, tasks) {
  const taskData = tasks[command]
  if (!taskData) {
    throw new Error(`"${command}" not in ${Object.keys(tasks)}`)
  }

  for (const subtask of taskData.dependencies) {
    await runTask(subtask, tasks)
  }

  await taskData.task(taskData.cli ? neodoc.run(taskData.cli) : undefined)
}

const pulp = {}

/**
 * Create a new task-list
 *
 * @return {Object} an object with a pair of methods; `add` and `run`
 */
pulp.tasks = () => {
  const tasks = {}

  return {
    async add () {
      if (arguments.length === 2) {
        var [name, task] = arguments
      } else if (arguments.length === 3) {
        var [name, dependencies, task] = arguments
      } else if (arguments.length === 4) {
        var [name, dependencies, cli, task] = arguments
      }

      tasks[name] = {name, cli, dependencies, task}
    },
    async run (opts) {
      const args = neodoc.run(`Usage: script <command>`, {allowUnknown: true})
      return runTask(args['<command>'], tasks)
    }
  }
}

module.exports = pulp
