# [savager](https://ddamato.github.io/savager/)

## `new Savager(symbols, options)`
The default export of the package, also available as a named export where needed. Constructs a new instance of Savager.

```js
// CommonJs, require syntax
const Savager = require('savager');
const symbols = require('./path/to/svgs.js');

const savager = new Savager(symbols);
```

```js
// ES6 Modules, import syntax
import Savager from 'savager';
import symbols from './path/to/svgs.js';

const savager = new Savager(symbols);
```

The constructor takes two arguments, the first argument (`symbols`) is a well-formed object of symbols. You may use the [`create-symbols`](#createsymbolspathorobject) script included in this package to help prepare the symbols. The second argument (`options`) can include a custom configuration from the options below.

## `createSymbols(pathOrObject)`
