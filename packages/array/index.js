
const array = { }

/**
 * Choose a single value from an array
 *
 * @param  {Array<any>} value an array of values
 * @return {any}        a randomly selected value from the array
 */
array.oneOf = value => {
  return value[Math.floor(Math.random() * value.length)]
}

module.exports = array
