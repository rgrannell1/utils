
const neodoc = {}

neodoc.parse = options => {
  const parsed = {}

  Object.entries(options).forEach(([key, val]) => {
    if (key.startsWith('--')) {
      parsed[key.replace('--', '')] = val
    } else {
      parsed[key] = val
    }
  })

  return parsed
}

module.exports = neodoc
