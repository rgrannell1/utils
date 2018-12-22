
## Usage

Pulp is used as a build-system for itself and the `utils` monorepository. The recommended build-folder structure is:

```js
// -- pulpfile.js

const pulp = require('@rgrannell/pulp')
const commands = require('./build/commands')

const tasks = pulp.tasks()

tasks.addAll(commands)
tasks.run().catch(err => {
  console.log(err)
  process.exit(1)
})
```

```js
// -- build/commands/index.js

const index = require('@rgrannell/index')

module.exports = index.load({source: __dirname})
```

```js
// -- build/commands/bar.js

const command = {
  name: 'bar',
  dependencies: []
}


command.cli = `
Usage:
  script bar

Description:
  This is a CLI command that is invoked by pulp. Add options or more details.
`

command.task = async args => {
  console.log('hello!')
}

module.exports = command
```

With `bar` being replaced by something more useful.
