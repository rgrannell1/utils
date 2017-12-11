
const docker = {}

docker.FILE = lines => lines.join('\n')

docker.FROM = (id, name) => {
  return name
    ? `FROM ${id} AS ${name}`
    : `FROM ${id}`
}

docker.RUN = commands => {
  return commands.map(command => `RUN ${command}`).join('\n');
}

docker.CMD = command => {
  return Array.isArray(command)
    ? `CMD ${JSON.stringify(command)}`
    : `CMD ${command}`
}

docker.LABEL = obj => {
  return Object.entries(obj).map(([key, val]) => {
    return `LABEL ${key}=${val}`
  }).join('\n');
}

docker.EXPOSE = port => {
  return `EXPOSE ${port}`
}

docker.ENV = obj => {
  return Object.entries(obj).map(([key, val]) => {
    return `ENV ${key}=${val}`
  }).join('\n');
}

docker.ADD = (sources, dest) => {
  return `ADD ${JSON.stringify(sources.concat([dest]))}`
}

docker.COPY = (sources, dest) => {
  return `COPY ${JSON.stringify(sources.concat([dest]))}`
}

docker.ENTRYPOINT = command => {
  return `ENTRYPOINT ${command}`
}

docker.WORKDIR => path => {
  return `WORKDIR ${path}`
}

docker.WORKDIR = path => {
  return `WORKDIR ${path}`
}

docker.HEALTHCHECK = ({interval, timeout}, content) => {
  return `HEALTHCHECK --interval=${interval} --timeout=${timeout} ${content}`
}

module.exports = docker
