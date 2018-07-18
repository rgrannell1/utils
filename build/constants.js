
const path = require('path')

const constants = {
  paths: {
    packages: path.join(__dirname, '../packages'),
    commands: path.join(__dirname, 'commands'),
    docs: path.join(__dirname, '../docs'),
    root: path.join(__dirname, '..'),
    buildReadme: path.join(__dirname, 'README.md'),
    state: path.join(__dirname, '../.state.json'),
    templates: {
      utilsReadme: path.join(__dirname, './resources/utils-readme.md.mustache'),
      packageReadme: path.join(__dirname, './resources/package-readme.md.mustache'),
      buildReadme: path.join(__dirname, './resources/build-readme.md.mustache')
    }
  },
  stability: {
    experimental: '0 - Experimental'
  },
  allowedBranchPrefixes: [
    'bugfix',
    'feature',
    'test'
  ]
}

module.exports = constants
