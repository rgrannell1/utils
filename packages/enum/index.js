
/**
 * Easily construct enums
 *
 * @name Enum
 *
 * @example
 *   Enum.colours(['red', 'yellow'])
 */
const Enum = function (elements, transform) {
  const asEnum = {}

  for (const elem of elements) {
    asEnum[elem] = transform ? transform(elem) : elem
  }

  return new Proxy(asEnum, {
    get (_, prop) {
      if (asEnum.hasOwnProperty(prop)) {
        return asEnum[prop]
      } else {
        throw new Error(`${Object.keys(asEnum).length}-element Enum does not include property "${prop}"`)
      }
    }
  })
}

module.exports = Enum
