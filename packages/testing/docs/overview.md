
## Overview

`testing` is a simple test-runner that allows you to describe tests in terms of:

- expectations & predicates
- hypotheses
- theories composed of hypotheses

this framework is a pure-JS test-runner, as opposed to `mocha` or `ava` which requires you to use external binaries.


## Usage

```js
const {
  hypothesis,
  theory
} = require('@rgrannell/testing')

const hypotheses = {}

hypotheses.add = hypothesis('adding zero to a number returns that number')
  .cases(function * () {
    yield [1]
    yield [2]
    yield [3]
  })
  .always(num => {
    return num + 0 === num
  })

theory({ description: 'Establish basic laws of addition are satisfied over numeric inputs' })
  .givenAll(hypotheses)
```