
const set = {}

set.equals = (set0, set1) => {
  if (set0.length !== set1.length) {
    return false
  } else {
    for (let val of Array.from(set0)) {
      if (!set0.has(val)) {
        return false
      }
    }
    return true
  }
}

set.union = (set0, set1) => {
  const conjunction = new Set([])

  for (let elem of set0) {
    conjunction.add(elem)
  }

  for (let elem of set1) {
    conjunction.add(elem)
  }

  return conjunction
}

set.intersection = (set0, set1) => {
  const shared = new Set([])

  for (let elem of set0) {
    if (set1.has(elem) {
      shared.add(elem)
    }
  }

  for (let elem of set1) {
    if (set0.has(elem) {
      shared.add(elem)
    }
  }

  return shared
}

module.exports = set
