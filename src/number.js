
const number = {}

number.percentify = num => Math.floor(num * 100) + '%'

number.medianOf = nums => {
	nums.sort( )

	if (nums.length === 0) {
		throw Error('cannot take median of empty list.')
	} else {
		return nums[Math.floor(nums.length / 2)]
	}
}


module.exports = number
