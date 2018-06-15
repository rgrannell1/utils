
const object = {}

/**
 * Return a clone of an object only containing the provided properties.
 *
 * @param  {Object} object an arbitrary object
 * @param  {Array<String>} props an array of property names to keep.
 *
 * @returns {Object} an object with a subset of
 *                     properties from an input object.
 */
object.restrict = (object, props) => {
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
 * @param  {Object} object an arbitrary object
 * @param  {Array<String>} props an array of property names to keep.
 *
 * @returns {Object} an object with a subset of
 *                     properties from an input object.
 */
object.remove = (object, props) => {
  const restricted = {}
  const propSet = new Set(props)

  Object.keys(object).forEach(prop => {
    if (!propSet.has(prop)) {
      restricted[prop] = object[prop]
    }
  })

  return restricted
}

object.take = (object, props) => {
  const restricted = {}

  Object.keys(props).forEach(prop => {
    restricted[prop] = object[prop]
  })

  return restricted
}

module.exports = object
