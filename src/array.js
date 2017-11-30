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

module.exports = array
