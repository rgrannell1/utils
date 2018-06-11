
{
  var types = {}

  let esbnTypes = new Set([
    'and',
    'excluding',
    'group',
    'literal',
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