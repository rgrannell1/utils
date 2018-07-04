
const standard = require('standard')

const command = {
  name: 'lint',
  dependencies: []
}

command.cli = `
Usage:
  script lint
`

command.task = () => {
  const target = process.cwd() + './packages/**/*.js'
  return new Promise((resolve, reject) => {
    standard.lintFiles(target, {}, (err, res) => {
      err ? reject(err) : resolve(res)
    })
  })
}

module.exports = command
