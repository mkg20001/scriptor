# scriptrr

Run scripts like nobody is watching

Takes a list of files and globs, transforms it into an object where every scriptfile is it's own callable function

# Example

code:

```js
const path = require('path')
const scripts = require('scriptrr')({
  files: path.join(__dirname, 'scripts'),
  options: {}
})

scripts.runUbuntuSetup("https://...", "/path/to.hda")
  .then(p => {
    console.log("Ubuntu VM was installed to /path/to.hda")
    console.log(String(p.stdout))
  })
  .catch(err => {
    console.error("It failed with " + err.toString())
  })
```

script:

```sh
#!/bin/bash

set -euo pipefail

# take the files from the arguments
ISO="$1"
HDA="$2"

TMPISO=$(mktemp -f) # use commands instead of extra modules, without tons of promises, directly in the script
wget -O "$TMPISO" "$ISO" # download using well-known tools instead of figuring it out with modules, etc

qemu-system-x86_64 -cdrom "$ISO" ... # ...more magic here, you get the idea
```

# API

- `scriptrr({})`
  - `{ files: [] }` Array of paths and/or globs to include in list of scripts
  - `{ showOutput: true/false }` Whether to pass output of the script to the main process or discard it
  - `{ options: {} }` Options for `child_process.spawn()`, see [ « node docs ](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options)
  - `{ shell: '/bin/zsh' }` Shell to use. Defaults to `/bin/bash` or `/bin/sh` if that's not available
