
## Usage

`@rgrannell1/config` loads configuration from a config folder; the file `default.js` yields default configuration and an arbitrary number of other environment files can also be included.

This module is explicitly parameterised with environment, which can be drawn from `process.env.NODE_ENV` or another source. Each file can export a function (of the default configuration) or an object.

```js
// -- ./config/default.js

module.exports = () => {
  return {
    url: 'https://example.com/foo/bar',
    timeout: 120,
    auth: {
      user: process.env.EXAMPLE_USER,
      user: process.env.EXAMPLE_PASS,
      secure: false
    }
  }
}
```
```js
// -- ./config/development.js

module.exports = defaults => {
  return {
    timeout: 60
  }
}
```
```js
// -- ./config/production.js
module.exports = defaults => {
  return {
    timeout: 10,
    auth: {
      secure: true
    }
  }
}
```

```js
const config = require('@rgrannell1/config')

const envConfig = config('production')

/*
{
    url: 'https://example.com/foo/bar',
    timeout: 10,
    auth: {
      user: process.env.EXAMPLE_USER,
      user: process.env.EXAMPLE_PASS,
      secure: true
    }
}
*/
```
