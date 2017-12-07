
const fs = require('fs')
const request = require('request-promise')
const digitalOceanUrl = 'https://api.digitalocean.com/v2'

const api = { }

api.listSSHKeys = () => {
  const listOpts = {
    url: `${digitalOceanUrl}/account/keys`,
    headers: {
      Authorization: `Bearer ${this.token}`
    }
  }

  return request.get(listOpts)
}

api.findSSHKeys = async fields => {
  if (Object.keys(fields).length === 0) {
    throw new Error('no fields provided.')
  }

  const res = JSON.parse(await api.listSSHKeys())

  return res.ssh_keys.find(keyFields => {
    return Object.keys(fields).every(field => {
      return keyFields[field] === fields[field]
    })
  })
}

api.newSSHKey = async (name, publicKey) => {
  const newOpts = {
    uri: `${digitalOceanUrl}/account/keys/`,
    headers: {
      Authorization: `Bearer ${this.token}`
    },
    json: {
      name,
      public_key: publicKey
    }
  }

  return request.post(newOpts)
}

api.updateSSHKey = async (name, publicKey) => {
  const existingKey = await api.findSSHKeys({name})

  const deleteOpts = {
    uri: `${digitalOceanUrl}/account/keys/${existingKey.id}`,
    headers: {
      Authorization: `Bearer ${this.token}`
    }
  }

  await request.delete(deleteOpts)
  await api.newSSHKey(name, publicKey)
}

api.setSSHKey = async (name, publicKey) => {
  const existingKey = await api.findSSHKeys({name})

  if (!existingKey) {
    return api.newSSHKey(name, publicKey)
  } else if (existingKey.public_key.trim() !== publicKey.trim()) {
    return api.updateSSHKey(name, publicKey)
  }
}

api.listDomainRecords = async (domain) => {
  const getOpts = {
    uri: `${digitalOceanUrl}/domains/${domain}/records`,
    headers: {
      Authorization: `Bearer ${this.token}`
    }
  }

  return request.get(getOpts)
}

api.findDomainRecord = async (domain, fields) => {
  if (Object.keys(fields).length === 0) {
    throw new Error('no fields provided.')
  }

  const res = JSON.parse(await api.listDomainRecords(domain))

  return res.domain_records.find(recordFields => {
    return Object.keys(fields).every(field => {
      return recordFields[field] === fields[field]
    })
  })
}

api.newDomainRecord = async conf => {
  const reqOpts = {
    uri: `${digitalOceanUrl}/domains/${conf.domain}/records`,
    headers: {
      Authorization: `Bearer ${this.token}`
    },`
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

api.removeDomainRecord = async (domain, subDomain) => {
  const existingRecord = await api.findDomainRecord(domain, {
    type: 'A',
    name: subDomain
  })

  if (existingRecord) {
    const reqOpts = {
      uri: `${digitalOceanUrl}/domains/${domain}/records/${existingRecord.id}`,
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    }

    await request.delete(reqOpts)
  }
}

api.setDomainRecord = async (conf) => {
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

    api.findDomainRecord(conf.domain, {
      type: 'A',
      name: conf.subDomain,
      data: ipv4Address
    }),
    api.findDomainRecord(conf.domain, {
      type: 'A',
      name: conf.subDomain
    })

  ])

  if (!existingRecord && existingSubdomainRecord) {
    await api.removeDomainRecord(conf.domain, conf.subDomain)
  }

  if (!existingRecord) {
    await api.newDomainRecord({
      domain: conf.domain,
      type: 'A',
      subDomain: conf.subDomain,
      ipv4Address,
      ttl: conf.ttl
    })
  }
}

api.listVMs = async () => {
  const reqOpts = {
    uri: `${digitalOceanUrl}/droplets?`,
    headers: {
      Authorization: `Bearer ${this.token}`
    }
  }

  return request.get(reqOpts)
}

api.findVMs = async fields => {
  if (Object.keys(fields).length === 0) {
    throw new Error('no fields provided.')
  }

  const res = JSON.parse(await api.listVMs())

  return res.droplets.find(keyFields => {
    return Object.keys(fields).every(field => {
      return keyFields[field] === fields[field]
    })
  })
}

api.newVm = async (conf) => {
  const reqOpts = {
    uri: `${digitalOceanUrl}/droplets`,
    headers: {
      Authorization: `Bearer ${this.token}`
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

api.setVM = async (conf, {sshKeyPath, sshKeyName, vmName}) => {
  const existingVM = await api.findVMs({
    name: vmName
  })

  const signaturePath = `${sshKeyPath}.sig`
  const signature = await new Promise((resolve, reject) => {
    fs.readFile(signaturePath, (err, body) => {
      err ? reject(err) : resolve(body.toString())
    })
  })

  const sshKey = await api.findSSHKeys({
    name: sshKeyName
  })

  if (signature !== sshKey.fingerprint) {
    const publicKey = await new Promise((resolve, reject) => {
      fs.readFile(`${sshKeyPath}.pub`, (err, content) => {
        err ? reject(err) : resolve(content.toString())
      })
    })

  //  await api.updateSSHKey(config.get('digitalOcean.sshKeyName'), publicKey)

  //  throw new Error(`mismatching local / remote SSH key signatures; ${ signature }, ${ sshKey.fingerprint }`)
  }

  if (!existingVM) {
    return api.newVm(Object.assign(conf, {
      fingerprint: sshKey.fingerprint
    }))
  }
}

function DigitalOcean (token) {
  this.token = token
}

Object.assign(DigitalOcean.prototype, {
  listSSHKeys () {
    return api.listSSHKeys()
  }
  findSSHKeys (fields) {
    return api.findSSHKeys(fields)
  }
  newSSHKey (name, publicKey) {
    return api.newSSHKey(name, public_key)
  }
  updateSSHKey (name, publicKey) {
    return api.updateSSHKey(name, publicKey)
  }
  setSSHKey (name, publicKey) {
    return api.setSSHKey(name, publicKey)
  }
  listDomainRecords (domain) {
    return api.listDomainRecords(domain)
  }
  findDomainRecord (domain, fields) {
    return api.findDomainRecord(domain, fields)
  }
  newDomainRecord (conf) {
    return api.newDomainRecord(conf)
  }
  removeDomainRecord (domain, subDomain) {
    return api.removeDomainRecord(domain, subDomain)
  }
  setDomainRecord (conf) {
    return api.setDomainRecord(conf)
  }
  listVMs () {
    return api.listVMs()
  }
  findVMs (fields) {
    return api.findVMs(fields)
  }
  newVm (conf) {
    return api.newVm(conf)
  }
  setVM (conf, {sshKeyPath, sshKeyName, vmName}) {
    return api.setVM(conf, {sshKeyPath, sshKeyName, vmName})
  }
})

module.exports = api
