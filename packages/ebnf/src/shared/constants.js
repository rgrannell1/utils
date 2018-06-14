
{
  var types = {}

  let esbnTypes = new Set([
    'and',
    'excluding',
    'group',
    'literal',
    'optional',
    'or',
    'ref',
    'repeat',
    'rule',
    'rules'
  ])

  for (let type of esbnTypes) {
    types[type] = type
  }
}

module.exports = {
  types
}