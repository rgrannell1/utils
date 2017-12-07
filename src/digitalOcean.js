
const fs = require('./fs')
const request = require('request-promise')
const digitalOceanUrl = 'https://api.digitalocean.com/v2'

const api = { }

api.listSSHKeys = (token) => {
  const listOpts = {
    url: `${digitalOceanUrl}/account/keys`,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  return request.get(listOpts)
}

api.findSSHKeys = async (token, fields) => {
  if (Object.keys(fields).length === 0) {
    throw new Error('no fields provided.')
  }

  const res = JSON.parse(await api.listSSHKeys(token))

  return res.ssh_keys.find(keyFields => {
    return Object.keys(fields).every(field => {
      return keyFields[field] === fields[field]
    })
  })
}

api.newSSHKey = async (token, name, publicKey) => {
  const newOpts = {
    uri: `${digitalOceanUrl}/account/keys/`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    json: {
      name,
      public_key: publicKey
    }
  }

  return request.post(newOpts)
}

api.updateSSHKey = async (token, name, publicKey) => {
  const existingKey = await api.findSSHKeys({name})

  const deleteOpts = {
    uri: `${digitalOceanUrl}/account/keys/${existingKey.id}`,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  await request.delete(deleteOpts)
  await api.newSSHKey(token, name, publicKey)
}

api.setSSHKey = async (token, name, publicKey) => {
  const existingKey = await api.findSSHKeys({name})

  if (!existingKey) {
    return api.newSSHKey(token, name, publicKey)
  } else if (existingKey.public_key.trim() !== publicKey.trim()) {
    return api.updateSSHKey(token, name, publicKey)
  }
}

api.listDomainRecords = async (token, domain) => {
  const getOpts = {
    uri: `${digitalOceanUrl}/domains/${domain}/records`,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  return request.get(getOpts)
}

api.findDomainRecord = async (token, domain, fields) => {
  if (Object.keys(fields).length === 0) {
    throw new Error('no fields provided.')
  }

  const res = JSON.parse(await api.listDomainRecords(token, domain))

  return res.domain_records.find(recordFields => {
    return Object.keys(fields).every(field => {
      return recordFields[field] === fields[field]
    })
  })
}

api.newDomainRecord = async (token, conf) => {
  const reqOpts = {
    uri: `${digitalOceanUrl}/domains/${conf.domain}/records`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    json: {
      type: conf.type,
      name: conf.subDomain,
      data: conf.ipv4Address,
      priority: null,
      port: null,
      ttl: conf.ttl,
      weight: null,
      flags: null,
      tag: null
    }
  }

  return request.post(reqOpts)
}

api.removeDomainRecord = async (token, domain, subDomain) => {
  const existingRecord = await api.findDomainRecord(token, domain, {
    type: 'A',
    name: subDomain
  })

  if (existingRecord) {
    const reqOpts = {
      uri: `${digitalOceanUrl}/domains/${domain}/records/${existingRecord.id}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    await request.delete(reqOpts)
  }
}

api.setDomainRecord = async (token, conf) => {
  const vm = await api.findVMs({
    name: conf.name
  })

  const ipv4Address = vm.networks.v4[0].ip_address

  if (!vm) {
    throw new Error('cannot add domain-record for non-existing droplet.')
  } else if (!ipv4Address) {
    throw new Error('cannot add domain-record for droplet without IP address.')
  }

  const [existingRecord, existingSubdomainRecord] = await Promise.all([

    api.findDomainRecord(token, conf.domain, {
      type: 'A',
      name: conf.subDomain,
      data: ipv4Address
    }),
    api.findDomainRecord(token, conf.domain, {
      type: 'A',
      name: conf.subDomain
    })

  ])

  if (!existingRecord && existingSubdomainRecord) {
    await api.removeDomainRecord(token, conf.domain, conf.subDomain)
  }

  if (!existingRecord) {
    await api.newDomainRecord(token, {
      domain: conf.domain,
      type: 'A',
      subDomain: conf.subDomain,
      ipv4Address,
      ttl: conf.ttl
    })
  }
}

api.listVMs = async (token) => {
  const reqOpts = {
    uri: `${digitalOceanUrl}/droplets?`,
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  return request.get(reqOpts)
}

api.findVMs = async (token, fields) => {
  if (Object.keys(fields).length === 0) {
    throw new Error('no fields provided.')
  }

  const res = JSON.parse(await api.listVMs(token))

  return res.droplets.find(keyFields => {
    return Object.keys(fields).every(field => {
      return keyFields[field] === fields[field]
    })
  })
}

api.newVm = async (token, conf) => {
  const reqOpts = {
    uri: `${digitalOceanUrl}/droplets`,
    headers: {
      Authorization: `Bearer ${token}`
    },
    json: {
      name: conf.name,
      region: conf.region,
      image: conf.image,
      size: conf.size,
      ssh_keys: [
        conf.fingerprint
      ],
      monitoring: true,
      user_data: conf.userData
    }
  }

  return request.post(reqOpts)
}

api.setVM = async (token, conf, {sshKeyPath, sshKeyName, vmName}) => {
  const existingVM = await api.findVMs(token, {
    name: vmName
  })

  const signaturePath = `${sshKeyPath}.sig`
  const signature = await new Promise((resolve, reject) => {
    return fs.readFile(signaturePath)
  })

  const sshKey = await api.findSSHKeys(token, {
    name: sshKeyName
  })

  if (signature !== sshKey.fingerprint) {
    const publicKey = await new Promise((resolve, reject) => {
      return fs.readFile(`${sshKeyPath}.pub`)
    })

  //  await api.updateSSHKey(config.get('digitalOcean.sshKeyName'), publicKey)

  //  throw new Error(`mismatching local / remote SSH key signatures; ${ signature }, ${ sshKey.fingerprint }`)
  }

  if (!existingVM) {
    return api.newVm(token, Object.assign(conf, {
      fingerprint: sshKey.fingerprint
    }))
  }
}


class DigitalOcean {
  constructor (token) {
    this.token = token
    return this
  }
  listSSHKeys () {
    return api.listSSHKeys(this.token)
  }
  findSSHKeys (fields) {
    return api.findSSHKeys(this.token, fields)
  }
  newSSHKey (name, publicKey) {
    return api.newSSHKey(this.token, name, public_key)
  }
  updateSSHKey (name, publicKey) {
    return api.updateSSHKey(this.token, name, publicKey)
  }
  setSSHKey (name, publicKey) {
    return api.setSSHKey(this.token, name, publicKey)
  }
  listDomainRecords (domain) {
    return api.listDomainRecords(this.token, domain)
  }
  findDomainRecord (domain, fields) {
    return api.findDomainRecord(this.token, domain, fields)
  }
  newDomainRecord (conf) {
    return api.newDomainRecord(this.token, conf)
  }
  removeDomainRecord (domain, subDomain) {
    return api.removeDomainRecord(this.token, domain, subDomain)
  }
  setDomainRecord (conf) {
    return api.setDomainRecord(this.token, conf)
  }
  listVMs () {
    return api.listVMs(this.token)
  }
  findVMs (fields) {
    return api.findVMs(this.token, fields)
  }
  newVm (conf) {
    return api.newVm(this.token, conf)
  }
  setVM (conf, {sshKeyPath, sshKeyName, vmName}) {
    return api.setVM(this.token, conf, {sshKeyPath, sshKeyName, vmName})
  }
}

module.exports = DigitalOcean
