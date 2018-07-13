
const path = require('path')

const constants = {
  paths: {
    packages: path.join(__dirname, '../packages'),
    commands: path.join(__dirname, 'commands'),
    docs: path.join(__dirname, '../docs'),
    root: path.join(__dirname, '..'),
    buildReadme: path.join(__dirname, 'README.md'),
    templates: {
      utilsReadme: path.join(__dirname, './resources/utils-README.md.mustache'),
      packageReadme: path.join(__dirname, './resources/package-README.md.mustache'),
      buildReadme: path.join(__dirname, './resources/build-README.md.mustache')
    }
  }
}

module.exports = constants
