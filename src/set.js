
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

module.exports = set
