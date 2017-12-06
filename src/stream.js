
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

stream.asPromise = ({reader, event, resolveOn, rejectOn = ['error']}) => {
  return new Promise((resolve, reject) => {

    for (let resolved of resolveOn ) {
      reader.once(resolved, resolve)
    }

    for (let rejected of rejectOn) {
      reader.once(rejected, reject)
    }

  })
}

module.exports = stream