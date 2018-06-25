
const readme = require('./index')

const metadata = readme.package.summariseExports('../ebnf')

console.log(metadata)
