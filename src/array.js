/**
 * @module utils/trello-api
 *
 * @description
 *
 * Array utilities
 *
 */

const array = {}

/**
 * @param {number} length of sequence
 *
 * Construct an array of indices.
 *
 * @returns {number[]}
 */
array.seqTo = num => {
  const nums = []

  for (let ith = 0; ith < num; ++ith) {
  	nums[ith] = ith
  }

  return nums
}

array.pluck = (key, coll) => coll.map(elem => elem[key])

Object.defineProperty(Array.prototype, 'groupBy', {
	enumerable: false,
	value: function (fn) {

		var table = { }

		this.forEach(elem => {

			const key  = fn(elem)
			table[key] = (table[key] || [ ]).concat(elem)

		})

		return table

	}
})



module.exports = array
