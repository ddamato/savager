# [savager](https://ddamato.github.io/savager/)

Managing SVG files in a project can be a pain. Savager tries to soothe the pain.

## Features
- Can create a [_reference sheet_](#what-is-a-reference-sheet) including only the icons you expect to use. No duplicated nodes in the DOM for the same icon!
- Can reference SVG files hosted externally to style with CSS; no reference sheet required here! (but more web requests).
- Can consolidate multiple reference sheets to reduce nodes.
- Can inject SVG markup that fails. ([`CORS`](https://www.codecademy.com/articles/what-is-cors) request ,[`ShadowDOM`](https://bitsofco.de/what-is-the-shadow-dom/))

### What is a _reference sheet_?
A reference sheet is an `<svg>` element using a collection of `<symbol>` elements inside. Each `<symbol>` is like a reusable variable that other `<svg>` elements on the page can reference from.

More information on this technique can be found in the article _[SVG symbol a Good Choice for Icons](https://css-tricks.com/svg-symbol-good-choice-icons/)_.

### Fallback with injection
When using the `<use>` tag in this method, you can reference a `<symbol>` by `id` if it's either:
- Within the same `document` (not `ShadowDOM`)
- Within the same domain as the page requesting it. (not `CORS` request)

This project attempts to provide fallbacks for cases that extend beyond the above limitations by injection.

An optional script is provided that _listens_ for when `<use>` nodes are unable to find the expected reference natively. The script will then attempt to find and copy the referenced markup and replace it with the target. This is helpful when your assets are hosted on a [CDN](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/) or `ShadowDOM` if leveraging the  for encapsulation.

But now that you've learned all of that, **_Savager does it all for you!_**

## Install

```sh
npm install savager
```

## API

### `new Savager(symbols, options)`
The default export of the package, also available as a named export where needed. Constructs a new instance of Savager.

```js
// CommonJS, require syntax
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

The constructor takes two arguments, the first argument (`symbols`) is a well-formed object of symbols. You may use the [`create-symbols` CLI](#cli) script included in this package to help prepare the symbols. The second argument (`options`) can include a custom configuration from the options below.

### `createSymbols(pathOrObject)`

## CLI
The `create-symbols` script targets a directory of `.svg` assets and prepares the necessary files for working with Savager. It uses the [`createSymbols` API method](createSymbols(pathOrObject)) under the hood.

| option | alias | description |
| ------ | ----- | ----------- |
| `input` | `-i` | (**required**) Target directory where `.svg` assets are located. |
| `output` | `-o` | (**required**) Target directory where compiled files will be written. |
| `type` | `-t` | (**optional**) File type. Can be set to `json`, `esm` (ES Modules), `cjs` (CommonJS). Default is `json`.

#### Example
```sh
create-symbols -i svg -o app/static/assets -t esm
```

The above will create new `.svg` assets in the `app/static/assets` directory along with a `symbols.js` file, written with ES Module syntax. You can move the `symbols.js` file elsewhere in the app depending on how you intend to use the project as it is needed to initialize a `new Savager()` instance.
