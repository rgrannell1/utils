
const array = { }

/**
 * Select a random value from an input array, using a non-cryptographically secure selector.
 *
 * @name array.oneOf
 *
 * @param  {Array<any>} value An array of arbitrary values
 *
 * @return {any}        a randomly selected element from the array
 */
array.oneOf = value => {
  return value[Math.floor(Math.random() * value.length)]
}

/**
 * Create an array of indices up to but not including a ceiling value provided.
 *
 * @name array.seqTo
 *
 * @param  {Number} number a positive number
 *
 * @return {Array<Number>} an array of indices
 */
array.seqTo = number => {
  let entries = []

  for (let ith = 0; ith < number; ++ith) {
    entries.push(ith)
  }

  return entries
}

/**
 * Return an array of indices for an input array
 *
 * @name array.seqAlong
 *
 * @param  {Array<Any>} array an arbitrary array
 *
 * @return {Array<Number>} return an array of indices for that array
 */
array.seqAlong = array => {
  return array.map((_, ith) => ith)
}

/**
 * Repeat an arbitrary value several times
 *
 * @name array.repeat
 *
 * @param  {Any} value    an arbitrary value to repeat
 * @param  {Number} count a nonnegative number describing the number of times to repeat the arbitrary value provided
 *
 * @example
 *   array.repeat('a',3)
 *
 * @return {Array<Any>}   an array of repeated values.
 */
array.repeat = (value, count) => {
  let copies = []

  for (let ith = 0; ith < count; ith++) {
    copies.push(value)
  }
  return copies
}

module.exports = array
