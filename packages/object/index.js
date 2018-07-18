
const object = {
  restrict: Symbol('restrict'),
  remove: Symbol('remove'),
  take: Symbol('take')
}

/**
 * Return a clone of an object only containing the provided properties.
 *
 * @name  Object\[object.restrict\]
 *
 * @param  {Object} object an arbitrary object
 * @param  {Array<String>} props an array of property names to keep.
 *
 * @returns {Object} an object with a subset of
 *                     properties from an input object.
 */
Object[object.restrict] = (object, props) => {
  const restricted = {}
  const propSet = new Set(props)

  Object.keys(object).forEach(prop => {
    if (propSet.has(prop)) {
      restricted[prop] = object[prop]
    }
  })

  return restricted
}

/**
 * Return a clone of an object removing selected properties.
 *
 * @name  Object\[object.remove\]
 *
 * @param  {Object} object an arbitrary object
 * @param  {Array<String>} props an array of property names to keep.
 *
 * @returns {Object} an object with a subset of
 *                     properties from an input object.
 */
Object[object.remove] = (object, props) => {
  const restricted = {}
  const propSet = new Set(props)

  Object.keys(object).forEach(prop => {
    if (!propSet.has(prop)) {
      restricted[prop] = object[prop]
    }
  })

  return restricted
}

/**
 * Select listed properties from an object
 *
 * @name  Object\[object.take\]
 *
 * @param  {Object} object
 * @param  {Array} props   a list of string
 *
 * @return {Object}
 */
Object[object.take] = (object, props) => {
  const restricted = {}

  props.forEach(prop => {
    restricted[prop] = object[prop]
  })

  return restricted
}

module.exports = object
