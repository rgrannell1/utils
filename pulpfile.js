
const pulp = require('@rgrannell/pulp')
const commands = require('./build/commands')

const tasks = pulp.tasks()

tasks.add('lint', commands.lint.deps, commands.lint.cli, commands.lint.task)

tasks.run().catch(err => process.exit(1))
