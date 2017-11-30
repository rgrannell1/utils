
/**
 *
 * @param {object} the object to assign from
 * @param {string[]} the properties to remove
 *
 * Remove unneeded properties
 *
 * @returns {object}
 *
 */
Object.defineProperty(Object, 'remove', {
  value (object, props) {
    const props = new Set(Array.isArray(props) ? props : [props])
    const reduced = {}

    for (let key of Object.keys(object)) {
      if (!props.has(key)) {
        reduced[key] = object[key]
      }
    }

    return reduced
  }
})
