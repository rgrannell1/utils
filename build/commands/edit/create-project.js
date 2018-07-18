
const fs = require('fs').promises
const path = require('path')
const constants = require('../../constants')
const inquirer = require('inquirer')

module.exports = async () => {
  const prompt = inquirer.createPromptModule()

  const {name} = await prompt({
    type: 'input',
    name: 'name',
    message: 'Project name:'
  })

  if (name.includes(' ') || name.includes(' ')) {
    console.error('Project name cannot contain whitespace')
    process.exit(1)
  }

  const {description} = await prompt({
    type: 'input',
    name: 'description',
    message: 'Project description:'
  })

  const packagePath = path.join(constants.paths.packages, name)

  await fs.mkdir(packagePath)
  await Promise.all([
    fs.mkdir(path.join(packagePath, 'tests')),
    fs.mkdir(path.join(packagePath, 'src'))
  ])

  const promises = {}

  promises.index = fs.writeFile(path.join(packagePath, 'index.js'), 'module.exports = {}')
  promises.packageJson = fs.writeFile(path.join(packagePath, 'package.json'), JSON.stringify({
    name: `@rgrannell/${name}`,
    description,
    main: 'index.js',
    version: 'none',
    license: 'MIT',
    publishConfig: {
      access: 'public'
    },
    dependencies: {}
  }, null, 2))

  await Promise.all([promises.index, promises.packageJson])
}
