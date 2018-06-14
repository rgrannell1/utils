
const array = { }

/**
 * Choose a single value from an array
 *
 * @param  {Array<any>} value an array of values
 *
 * @return {any}        a randomly selected value from the array
 */
array.oneOf = value => {
  return value[Math.floor(Math.random() * value.length)]
}

/**
 * Create indices up to a number
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
 * Return an array of indices for an array
 *
 * @param  {Array<Any>} array an arbitrary array
 *
 * @return {Array<Number>} return an array of indices
 */
array.seqAlong = array => {
  return array.map((_, ith) => ith)
}

array.repeat = (value, count) => {
	let copies = []

	for (let ith = 0; ith < count; ith++) {
		copies.push(value)
	}
	return copies
}

module.exports = array
