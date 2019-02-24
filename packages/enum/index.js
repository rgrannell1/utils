
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

  return asEnum
}

module.exports = Enum
