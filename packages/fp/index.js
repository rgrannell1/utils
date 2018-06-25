

const fp = {}

/**
 * Identity function
 *
 * @param  {any}       value an arbitrary value
 *
 * @return {any}       the same input value
 */
fp.id = value => value

/**
 * Constant function
 *
 * @param  {any}       value an arbitrary
 * @return {function}  a function yielding that value
 */
fp.constant = value => () => value

/**
 * Returns a function that selects properties from an object
 *
 * @param  {string}   prop an object property name
 * @return {function} a function that selects object properties.
 */
fp.pluck = prop => value => value[prop]

module.exports = fp
