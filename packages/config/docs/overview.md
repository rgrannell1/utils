
## Overview

`@rgrannell1/config` is similar to `config`, but was implemented to fix several huge irritants to me:

- Lack of explicit environment parametres; `config` relies on environmental variables making it difficult to supply the environment argument via the CLI.
- Lack of access to default configuration from each specific environments file. Occassionally environment configuration can be expressed as a function of the default configuration.

In most other ways, `@rgrannell1/config` works like `config`.
