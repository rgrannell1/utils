
const fp = {}

/**
 * Identity function
 *
 * @param  {any} value an arbitrary value
 *
 * @return {any}       the same input value
 */
fp.id = value => value

/**
 * Constant function
 *
 * @param  {any} value an arbitrary
 * @return {function}  a function yielding that value
 */
fp.constant = value => () => value

module.exports = fp
