
const {expect} = require('chai')
const chain = require('@rgrannell/chain')
const models = require('./models')
const reporters = require('./reporters')

const methods = {}

/**
 * @name theory.given
 *
 * Add a single hypotheses to a theory
 *
 * @param  {Object} hypothesis    a hypothesis object.
 * @return {Object} an object with several methods:
 *   - given()
 *   - givenAll()
 *   - run()
 *
 */
methods.given = (state, hypothesis) => {
  expect(hypothesis).to.be.an('object', `"hypothesis" must be an object for theory "${state.description}"`)

  state.hypotheses.push(hypothesis)

  return chain({
    given: methods.given,
    givenAll: methods.givenAll,
    run: methods.run
  }, state)
}

/**
 * @name theory.givenAll
 *
 * Add multiple hypotheses to a theory
 *
 * @param  {Object} hypotheses    an object of name - hypothesis mappings.
 * @return {Object}               an object with several methods:
 *   - given()
 *   - givenAll()
 *   - run()
 *
 */
methods.givenAll = (state, hypotheses) => {
  expect(hypotheses).to.be.an('object', '"hypotheses" must be an object')
  const hypothesesNames = Object.keys(hypotheses)

  expect(hypothesesNames).to.not.have.length(0, 'must supply at least one hypothesis')

  for (const name of hypothesesNames) {
    expect(hypotheses[name]).to.be.an('object', `"hypotheses[${name}]" should be an object`)
    const hypothesis = hypotheses[name]

    expect(hypothesis).to.be.an('object')

    expect(hypothesis.run).to.be.a('function', `${name}.run was not a function`)
    state.hypotheses.push(hypothesis)
  }

  return chain({
    given: methods.given,
    givenAll: methods.givenAll,
    run: methods.run
  }, state)
}

/**
 * @name theory.run
 *
 * @param  {string} options.report    should the report be displayed?
 * @return {theoryResultSet}          returns a data-model
 *
 */
methods.run = async (state, opts = {}) => {
  expect(state.hypotheses).to.be.an('array')

  if (state.hypotheses.length === 0) {
    throw new Error(`no hypotheses for theory "${state.description}"`)
  }

  const results = await Promise.all(state.hypotheses.map(hypothesis => {
    return hypothesis.run()
  }))

  const data = models.theoryResultSet(state, results)
  if (opts.report) {
    expect(opts.report).to.be.a('boolean', 'if present, "options.report" must be a boolean')
    reporters.tap(results, opts)
  }

  return data
}

/**
 * @name testing.theory
 *
 * @param  {string} options.description    the description of the hypothesis being tested.
 * @return {Object}                        returns an object with several methods:
 *   - .run()
 *   - .given()
 *   - .givenAll()
 */
module.exports = ({description}) => {
  expect(description).to.be.a('string', '"options.description" must be a string')

  return chain({
    run: methods.run,
    given: methods.given,
    givenAll: methods.givenAll
  }, {
    description,
    hypotheses: [],
    type: 'theory'
  })
}
