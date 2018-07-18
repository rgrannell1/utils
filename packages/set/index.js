
const set = {}

/**
 * Do two sets contain the same values?
 *
 * @name set.equals
 *
 * @param  {Set} set0 a set
 * @param  {Set} set1 a set
 *
 * @return {boolean} true
 */
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

/**
 * Return a set containing the conjunction of two sets
 *
 * @name set.union
 *
 * @param  {Set} set0 a set
 * @param  {Set} set1 a set
 *
 * @return {Set} a conjoined set
 */
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

/**
 * Return a set containing elements in both sets
 *
 * @name set.intersection
 *
 * @param  {Set} set0 a set
 * @param  {Set} set1 a set
 *
 * @return {Set} an intersected set
 */
set.intersection = (set0, set1) => {
  const shared = new Set([])

  for (let elem of set0) {
    if (set1.has(elem)) {
      shared.add(elem)
    }
  }

  for (let elem of set1) {
    if (set0.has(elem)) {
      shared.add(elem)
    }
  }

  return shared
}

/**
 * Return the elements in set1 not in set0
 *
 * @name set.diff
 *
 * @param  {Set} set0 a set
 * @param  {Set} set1 a set
 *
 * @return {Set} the subset of the two provided sets
 */
set.diff = (set0, set1) => {
  const diffed = new Set([])

  for (let elem of set1) {
    if (!set0.has(elem)) {
      diffed.add(elem)
    }
  }

  return diffed
}

module.exports = set
