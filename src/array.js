
const array = {}

array.seqTo = num => {
  const nums = []

  for (let ith = 0; ith < num; ++ith) {
  	nums[ith] = ith
  }

  return nums
}

module.exports = array
