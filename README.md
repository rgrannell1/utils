
# utils

[![Build Status](https://travis-ci.org/rgrannell1/utils.svg?branch=master)](https://travis-ci.org/rgrannell1/utils)

A monorepository for publishing my utility modules 🎁⚙️

This module contains code I constantly copied as per-package utilities, and a few experimental modules & build systems. Feel free to clone / contribute, but these modules are **NOT** production-ready yet.

## Packages

- **@rgrannell/array (v8.0.0)**: Various array utilities
- **@rgrannell/async (v8.0.0)**: Various async utilities
- **@rgrannell/build (v8.0.0)**: Various package.json build utilities
- **@rgrannell/chain (v8.0.0)**: Builder-pattern utility
- **@rgrannell/config (v8.0.0)**: An alternative to config.js
- **@rgrannell/docker (v8.0.0)**: Utilities for constructing docker files from JavaScript
- **@rgrannell/ebnf (v8.0.0)**: Construct a generator for an EBNF grammar
- **@rgrannell/fp (v8.0.0)**: Functional programming utilities
- **@rgrannell/generator (v8.0.0)**: An itertools like library
- **@rgrannell/js-generator (v8.0.0)**: An itertools-like library
- **@rgrannell/markdown (v8.0.0)**: A utility library for generating markdown from JavaScript
- **@rgrannell/mustache (v8.0.0)**: A utility library for generating mustache templates from JavaScript
- **@rgrannell/object (v8.0.0)**: A utility library for working with objects
- **@rgrannell/promise (v8.0.0)**: Utilities for working with promises
- **@rgrannell/pulp (v8.0.0)**: A rational, tiny build system
- **@rgrannell/readme (v8.0.0)**: A tool for generating readme&#39;s
- **@rgrannell/set (v8.0.0)**: Utilities for working with sets
- **@rgrannell/ssl-labs (v8.0.0)**: A wrapper for SSL-Labs
- **@rgrannell/units (v8.0.0)**: A library for working with promises

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

### pre-commit

- dependencies: lint

```

```


## License

Copyright (c) 2018 Ryan Grannell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
