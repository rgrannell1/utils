
const chain = require('@rgrannell/chain')

const units = {}

const numericPrefixes = {
  yotta: 10e24,
  zetta: 10e21,
  exa: 10e18,
  peta: 10e15,
  tera: 10e12,
  giga: 10e9,
  mega: 10e6,
  kilo: 10e3,
  centi: 10e-2,
  milli: 10e-3,
  micro: 10e-6,
  nano: 10e-9,
  pico: 10e-12,
  femto: 10e-15,
  atto: 10e-18,
  zepto: 10e-21,
  yocto: 10e-24
}

units.time = [
  'seconds'
]

module.exports = units
