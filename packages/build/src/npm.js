
const fs = require('fs')
const execa = require('execa')

const npm = {}

const assertPackage = () => {
  let packageExists = fs.existsSync('package.json')
  if (!packageExists) {
    throw new Error('package.json not found.')
  }
}

npm.install = async ({production}) => {
  assertPackage()

  let flags = []

  if (production) {
    flags.push('--production')
  }

  // .stdout.pipe(process.stdout)
  return execa('npm', ['install'].concat(flags))
}

npm.ls = async ({json, production}) => {
  assertPackage()

  let flags = []

  if (json) {
    flags.push('--json')
  }
  if (production) {
    flags.push('--production')
  }

  return execa('npm', ['ls'].concat(flags))
}

npm.ls({json: true})

module.exports = npm
