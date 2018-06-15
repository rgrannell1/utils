
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

  return new Proxy(state, {
    get (_, prop) {
      if (methods.hasOwnProperty(prop)) {
        return methods[prop].bind(null, state)
      }
    }
  })
}

module.exports = chain
