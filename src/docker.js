
const docker = {}

docker.file = lines => lines.join('\n')

docker.from = (id, name) => {
  return name
    ? `FROM ${id} AS ${name}`
    : `FROM ${id}`
}

docker.run = command => {
  return array.isArray(command)
    ? `RUN ${JSON.stringify(command)}`
    : `RUN ${command}`
}

docker.cmd = command => {
  return array.isArray(command)
    ? `CMD ${JSON.stringify(command)}`
    : `CMD ${command}`
}

docker.label = (key, value) => {
  return `LABEL "${key}"="${value}"`
}

docker.expose = port => {
  return `EXPORT ${port}`
}

docker.env = (key, val) => {
  return `ENV ${key}="${val}"`
}

docker.add = (sources, dest) => {
  return `ADD ${JSON.stringify(sources.concat([dest]))}`
}

docker.copy = (sources, dest) => {
  return `COPY ${JSON.stringify(sources.concat([dest]))}`
}

docker.entrypoint = command => {
  return `ENTRYPOINT ${command}`
}

docker.workdir = path => {
  return `WORKDIR ${path}`
}
