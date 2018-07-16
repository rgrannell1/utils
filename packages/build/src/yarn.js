
const fs = require('fs')
const execa = require('execa')

const yarn = {}

const assertPackage = () => {
  let packageExists = fs.existsSync('package.json')
  if (!packageExists) {
    throw new Error('package.json not found.')
  }
}

yarn.install = async () => {
  assertPackage()

  let flags = []

  return execa('yarn', ['install'].concat(flags))
    .stdout.pipe(process.stdout)
}

module.exports = yarn
