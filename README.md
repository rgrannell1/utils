# utils

[![Build Status](https://travis-ci.org/rgrannell1/utils.svg?branch=master)](https://travis-ci.org/rgrannell1/utils)

A monorepository for publishing utility modules

## Packages

- [**@rgrannell/array (v8.0.0)**: Various array utilities](../../tree/master/packages/array)
- [**@rgrannell/async (v8.0.0)**: Various async utilities](../../tree/master/packages/async)
- [**@rgrannell/build (v8.0.0)**: Various package.json build utilities](../../tree/master/packages/build)
- [**@rgrannell/chain (v8.0.0)**: Builder-pattern utility](../../tree/master/packages/chain)
- [**@rgrannell/config (v8.0.0)**: An alternative to config.js](../../tree/master/packages/config)
- [**@rgrannell/docker (v8.0.0)**: Utilities for constructing docker files from JavaScript](../../tree/master/packages/docker)
- [**@rgrannell/ebnf (v8.0.0)**: Construct a generator for an EBNF grammar](../../tree/master/packages/ebnf)
- [**@rgrannell/fp (v8.0.0)**: Functional programming utilities](../../tree/master/packages/fp)
- [**@rgrannell/generator (v8.0.0)**: An itertools like library](../../tree/master/packages/generator)
- [**@rgrannell/js-generator (v8.0.0)**: An itertools-like library](../../tree/master/packages/js-generator)
- [**@rgrannell/markdown (v8.0.0)**: A utility library for generating markdown from JavaScript](../../tree/master/packages/markdown)
- [**@rgrannell/mustache (v8.0.0)**: A utility library for generating mustache templates from JavaScript](../../tree/master/packages/mustache)
- [**@rgrannell/object (v8.0.0)**: A utility library for working with objects](../../tree/master/packages/object)
- [**@rgrannell/promise (v8.0.0)**: Utilities for working with promises](../../tree/master/packages/promise)
- [**@rgrannell/pulp (v8.0.0)**: A rational, tiny build system](../../tree/master/packages/pulp)
- [**@rgrannell/readme (v8.0.0)**: A tool for generating readme's](../../tree/master/packages/readme)
- [**@rgrannell/set (v8.0.0)**: Utilities for working with sets](../../tree/master/packages/set)
- [**@rgrannell/ssl-labs (v8.0.0)**: A wrapper for SSL-Labs](../../tree/master/packages/ssl-labs)
- [**@rgrannell/units (v8.0.0)**: A library for working with promises](../../tree/master/packages/units)

## Build System

### lint

- dependencies: 

```

Usage:
  script lint
Description:
  lint and autofix package files

```

### lerna-publish

- dependencies: lint,document

```

Usage:
  script lerna-publish

```

### assert-valid-packages

- dependencies: 

```

Usage:
  script assert-valid-packages

```

### document

- dependencies: assert-valid-packages

```

Usage:
  script document
Description:
  Generate package documentation.

```


## License


Copyright (c) 2018 Ryan Grannell

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.