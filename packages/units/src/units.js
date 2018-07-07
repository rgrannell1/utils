
const units = {}

const factor = factor => quantity => factor * quantity
const offset = offset => quantity => quantity - offset
const convert = transform => quantity => transform(quantity)

units.prefixes = {
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

units.definitions = {
  second: {
    minute: convert(factor(1 / 60)),
    hour: convert(factor(1 / 3600)),
    day: convert(factor(1 / 86400)),
    year: convert(factor(1 / 31557600))
  },
  metre: {
    inch: convert(factor(39.3701)),
    feet: convert(factor(3.28084)),
    mile: convert(factor(0.000621371))
  },
  kelvin: {
    celsius: convert(offset(-273.15))
  }
}

module.exports = units
