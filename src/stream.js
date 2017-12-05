
const stream = {}

stream.asReadStream = data => {
  const dstream = new stream.Readable()
  dstream.push(data)
  dstream.push(null)
  return dstream
}

stream.isReadable = data => {
  return data.readable
}

stream.once = ({reader, event, rejectOn = ['error']}) => {
  return new Promise((resolve, reject) => {
    reader.once(event, reject)

    for (let rejected of rejectOn) {
      reader.once(rejected, reject)
    }

  })
}

module.exports = stream