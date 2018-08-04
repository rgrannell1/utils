
const {expect} = require('chai')

/**
 * Create a builder-pattern function
 *
 * @param  {Object} methods An object of functions, with the property being the method-name, the
 *                            value being the method to call. A state object is bound to the methods first parameter.
 * @param  {Object} state   A state object
 * @return {Proxy}          A proxy that intercepts the method name & dispatches the correct function.
 */
const chain = (methods, state = {}) => {
  expect(methods).to.be.an('object')

  Object.keys(methods).forEach(key => {
    const method = methods[key]
    expect(method, `invalid value for methods.${key}`).to.be.a('function')
  })

  const obj = {
    state
  }

  for (const method of Object.keys(methods)) {
    obj[method] = methods[method].bind(null, state)
  }

  return obj
}

module.exports = chain
