
const pulp = require('@rgrannell/pulp')
const commands = require('./build/commands')

const tasks = pulp.tasks()

tasks.add(commands.lint)
tasks.add(commands.lernaPublish)

tasks.run().catch(err => {
  console.log(err)
})
