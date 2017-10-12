# maybe-config
### Easy, safe configuration traversal.

maybe-config is a package designed to safely traverse configuration objects, allowing
deep trawling without fear of errors from incorrect keys, undefineds, and all the 
goodness that usually comes out of working with Javascript.

maybe-config uses the concept of the Maybe monad to allow for safe traversal. The final
usage for interface by default provides plain values, but also provides Safe variants
that instead return the Maybe instance for further safe processing.

## Usage

```javascript
// my-config.js
// Create a passthrough module that will set the context for your Config object
const Config = require('maybe-config');

module.exports = Config(window.myConfig);
```

```javascript
// Import your passthrough module to have a ready to use config object
const Config = require('./my-config');

// Grab a single value from the root.
const setting1 = Config.get('setting1');

// Grab a value from a path
const setting2 = Config.getIn('setting1', 'setting2');

// (client specific) grab a value starting at the 'settings' root key.
const clientSetting = Config.getClientSetting('clientSetting');

// Get a flag from the 'flags' root key as a bool.
const hasHeader = Config.getFlag('hasHeader');

// simply add Safe to the end of any method name to get a Maybe instance
const clientNameUpper = Config.getSafe('name').map(name => name.toUpperCase()).value();
```
