
const path = require('path')

const constants = {
  paths: {
    packages: path.join(__dirname, '../packages'),
    docs: path.join(__dirname, '../docs'),
    root: path.join(__dirname, '..'),
    utilsReadmeTemplate: path.join(__dirname, './resources/utils-README.md.mustache'),
    packageReadmeTemplate: path.join(__dirname, './resources/package-README.md.mustache')
  }
}

module.exports = constants
