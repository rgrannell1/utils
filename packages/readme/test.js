
const readme = require('./index')

const metadata = readme.package.extractMetadata('../ebnf')

console.log(JSON.stringify(metadata, null, 2))
