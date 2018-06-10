
const array = { }

array.oneOf (value) {
  return value[Math.floor(Math.random() * value.length)]
}

module.exports = array
