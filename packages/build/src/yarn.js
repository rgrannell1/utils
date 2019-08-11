
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

  const { stdout, stderr } = await execa('yarn', ['install'].concat(flags))

  console.log(stdout)
  console.error(stderr)
}

module.exports = yarn
