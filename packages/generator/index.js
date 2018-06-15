
const generator = {}

/**
 * Infinitly cycle a generator
 *
 * @param {Generator} gen a generator function
 * @yield {Any}
 */
generator.cycle = function* (gen) {
  while (true) {
    for (const elem of gen()) {
      yield elem
    }
  }
}

/**
 * Repeat a generator a fixed number of times
 *
 * @param {Generator} gen a generator function
 * @yield {Any}
 */
generator.repeat = function* (gen, num) {
  for (let ith = 0; ith < num; ++ith) {
    for (const elem of gen()) {
      yield elem
    }
  }
}

/**
 * Map across an iterable
 *
 * @param {Function} fn    an arbitrary non-generator function
 * @param {Any}   iter     the iterator to transform
 * @yield {Any}            a transformed iterator
 */
generator.iterMap = function* (fn, iter) {
  for (let elem of iter) {
    yield fn(elem)
  }
}

/**
 * Filter an iterable
 *
 * @param {Function} pred  a boolean function
 * @param {Any}   iter     the iterator to filter
 * @yield {Any}            a filtered iterator
 */
generator.iterSelect = function* (pred, iter) {
  for (let elem of iter) {
    if (pred(elem)) {
      yield elem
    }
  }
}

function* cross (iter0, gen0) {
  for (const elem0 of iter0) {
    for (const elem1 of gen0()) {
      yield elem0.concat(elem1)
    }
  }
}

/**
 * Take the cross-product of several generators
 *
 * @param {Array<Gen>} gens an array of nullary generator functions
 * @yield {Array<Any>}
 */
generator.crossProduct = function* (gens) {
  if (gens.length === 0) {
    return
  }

  const [head, ...tail] = gens
  let acc = generator.iterMap(val => ([val]), head())

  for (let currentGen of tail) {
    acc = cross(acc, currentGen)
  }

  yield* acc
}

generator.increment = function* (num) {
  let ith = 0
  while (true) {
    if (ith + 1 === num) {
      break
    } else {
      yield ith
      ith++
    }
  }
}

module.exports = generator
