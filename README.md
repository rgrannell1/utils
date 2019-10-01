
# utils

[![Build Status](https://travis-ci.org/rgrannell1/utils.svg?branch=master)](https://travis-ci.org/rgrannell1/utils)

A monorepository for publishing my utility modules 🎁🎁🎁⚙️

This module contains code I constantly copied as per-package utilities, and a few experimental modules & build systems. Feel free to clone / contribute, but these modules are **NOT** production-ready yet.

## Packages

- [**@rgrannell/array (v9.0.0)**: Various array utilities](../../tree/master/packages/array)
- [**@rgrannell/build (v9.0.0)**: Various package.json build utilities](../../tree/master/packages/build)
- [**@rgrannell/chain (v9.0.0)**: Builder-pattern utility](../../tree/master/packages/chain)
- [**@rgrannell/config (v9.0.0)**: An alternative to config.js](../../tree/master/packages/config)
- [**@rgrannell/create (v9.0.0)**: Creates a react-app](../../tree/master/packages/create)
- [**@rgrannell/docker (v9.0.0)**: Utilities for constructing docker files from JavaScript](../../tree/master/packages/docker)
- [**@rgrannell/ebnf (v9.0.0)**: Construct a generator for an EBNF grammar](../../tree/master/packages/ebnf)
- [**@rgrannell/errors (v9.0.0)**: Construct errors](../../tree/master/packages/errors)
- [**@rgrannell/fp (v9.0.0)**: Functional programming utilities](../../tree/master/packages/fp)
- [**@rgrannell/generator (v9.0.0)**: An itertools like library](../../tree/master/packages/generator)
- [**@rgrannell/github (v9.0.0)**: Utilities for working with Github](../../tree/master/packages/github)
- [**@rgrannell/index (v9.0.0)**: A utility library for loading submodules](../../tree/master/packages/index)
- [**@rgrannell/js-generator (v9.0.0)**: An itertools-like library](../../tree/master/packages/js-generator)
- [**@rgrannell/markdown (v9.0.0)**: A utility library for generating markdown from JavaScript](../../tree/master/packages/markdown)
- [**@rgrannell/mustache (v9.0.0)**: A utility library for generating mustache templates from JavaScript](../../tree/master/packages/mustache)
- [**@rgrannell/object (v9.0.0)**: A utility library for working with objects](../../tree/master/packages/object)
- [**@rgrannell/promise (v9.0.0)**: Utilities for working with promises](../../tree/master/packages/promise)
- [**@rgrannell/pulp (v9.0.0)**: A rational, tiny build system](../../tree/master/packages/pulp)
- [**@rgrannell/readme (v9.0.0)**: A tool for generating readme's](../../tree/master/packages/readme)
- [**@rgrannell/set (v9.0.0)**: Utilities for working with sets](../../tree/master/packages/set)
- [**@rgrannell/ssl-labs (v9.0.0)**: A wrapper for SSL-Labs](../../tree/master/packages/ssl-labs)
- [**@rgrannell/testing (v9.0.0)**: test utilities](../../tree/master/packages/testing)
- [**@rgrannell/units (v9.0.0)**: A library for working with promises](../../tree/master/packages/units)

## Package Metadata

| Name          | Version       | Dependencies     | Dev Dependencies        | Estimated Size |
| ------------- | ------------- | ---------------- | ----------------------- | -------------- |
| array | 9.0.0   | 0 | 0      | 0.0Mb       |
| build | 9.0.0   | 1 | 0      | 0.0Mb       |
| chain | 9.0.0   | 1 | 0      | 0.0Mb       |
| config | 9.0.0   | 1 | 0      | 0.0Mb       |
| create | 9.0.0   | 2 | 1      | 12.3Mb       |
| docker | 9.0.0   | 0 | 0      | 0.0Mb       |
| ebnf | 9.0.0   | 5 | 0      | 0.0Mb       |
| errors | 9.0.0   | 0 | 0      | 0.0Mb       |
| fp | 9.0.0   | 0 | 1      | 0.1Mb       |
| generator | 9.0.0   | 0 | 0      | 0.0Mb       |
| github | 9.0.0   | 1 | 0      | 0.0Mb       |
| index | 9.0.0   | 0 | 0      | 0.0Mb       |
| js-generator | 9.0.0   | 0 | 0      | 0.0Mb       |
| markdown | 9.0.0   | 0 | 0      | 0.0Mb       |
| mustache | 9.0.0   | 0 | 0      | 0.0Mb       |
| object | 9.0.0   | 0 | 0      | 0.0Mb       |
| promise | 9.0.0   | 0 | 0      | 0.0Mb       |
| pulp | 9.0.0   | 3 | 0      | 0.0Mb       |
| readme | 9.0.0   | 1 | 0      | 0.0Mb       |
| set | 9.0.0   | 1 | 0      | 0.0Mb       |
| ssl-labs | 9.0.0   | 1 | 0      | 0.0Mb       |
| testing | 9.0.0   | 4 | 0      | 0.1Mb       |
| units | 9.0.0   | 0 | 0      | 0.0Mb       |

## Build System

### assert-valid-packages

- dependencies: `none`

```

Usage:
  script assert-valid-packages

Description:
  Ensure that package configuration is valid

```

### depcheck

- dependencies: `none`

```

Usage:
  script depcheck

Description:
  Find unused dependencies

```

### document

- dependencies: `assert-valid-packages`

```

Usage:
  script document
Description:
  Generate package documentation.

```

### edit

- dependencies: `none`

```

Usage:
  script edit

Description:
  Manage the utils repository interactively

```

### install-deps

- dependencies: `assert-valid-packages`

```

Usage:
  script install-deps

Description:
  Install npm dependencies for each package

```

### lerna-bootstrap

- dependencies: `assert-valid-packages,lint,install-deps,depcheck,document`

```

Usage:
  script lerna-bootstrap

Description:
  Bootstrap lerna packages.

```

### lerna-publish

- dependencies: `none`

```

Usage:
  script lerna-publish

Description:
  Use lerna to deploy each submodule to deploy each submodule to NPM.

```

### lint

- dependencies: `none`

```

Usage:
  script lint

Description:
  lint and autofix package files

```

### pre-commit

- dependencies: `lint,depcheck`

```

Usage:
  script pre-commit

Description:
  Run precommit checks against this repository.

Options:
  --params PARAMS

```

### test

- dependencies: `none`

```

Usage:
  script test

Description:
  Run tests for each submodule

```


## Stability Index

> 0 - Experimental - Back-incompatible changes will be made arbitrarily, testing and documentation is poor, and there are probably many bugs.

## License

Copyright (c) 2019 Róisín Grannell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
