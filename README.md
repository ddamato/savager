<a href="https://ddamato.github.io/savager">
  <img width="200" src="savager-logo.svg">
</a>

[![npm version](https://img.shields.io/npm/v/savager.svg)](https://www.npmjs.com/package/savager)
[![Build Status](https://travis-ci.org/ddamato/savager.svg?branch=master)](https://travis-ci.org/ddamato/savager)
[![Coverage Status](https://coveralls.io/repos/github/ddamato/savager/badge.svg?branch=master)](https://coveralls.io/github/ddamato/savager?branch=master)

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
const symbols = require('./path/to/manifest.js');

const savager = new Savager(symbols, options);
```

```js
// ES6 Modules, import syntax
import Savager from 'savager';
import symbols from './path/to/manifest.js';

const savager = new Savager(symbols);
```

The constructor takes two arguments, the first argument (`symbols`) is a well-formed object of symbols. You may use the [`create-symbols` CLI](#cli) script included in this package to help prepare the symbols. The second argument (`options`) can include a custom configuration from the options below.

### `savager.prepareAssets(assetNames, options)`
This is the primary method you'll be invoking, it will return all the assets you'll need to include in your app that you request by name.

```js
import Savager from 'savager';
import symbols from './path/to/manifest.js';

const savager = new Savager(symbols);
const options = {
  attemptInject: false,
  autoAppend: false,
  classNames: null,
  consolidate: true,
  externalPath: false,
  toSvgElement: false,
};
const { assets, sheet, inject } = savager.prepareAssets(['balloon', 'checkmark'],options);
```

The method returns an object with up to 3 keys.
| Key | Value | Description |
| --- | ----- | ----------- |
| `assets` | `object` | A map of all your requested assets, accessed by the asset name. The value will depend on what was set as `toSvgElement`. |
| `sheet` | `undefined`, `string`, `SVGElement`, or custom output depending on options | This is the reference sheet, it can be provided as a string or as an element (using `toSvgElement`). This will be `undefined` when using the `externalPath` option. |
| `inject` | `undefined`, or `function` | The function to include in your app to listen for `<svg>` elements that fail find a reference. This will only return a function if `attemptInject` is set as `true` in the options. |

#### `savager.storeSymbols(symbols)`;
This helper method allows you to include additional symbols to reference _after_ calling the constructor.

### Options
These are the available options which can be passed into the second parameter of either the `new Savager()` constructor or `.prepareAssets()`.

Using it on the constructor _affects every call of `.prepareAssets()`_ made from the instance.

Using it on the method `.prepareAssets()` _affects only that call_.

#### `attemptInject`
**`Boolean`** `false`

When set to `true`, provides the `inject` function to be added to the page. Also adds listeners to the SVGs provided under the `assets` key to talk with the `inject` function.

#### `autoAppend`
**`Boolean`** `false`

Will attempt to automatically append the reference sheet to the `document.body` if the `.prepareAssets()` method was called on the page.

#### `classNames`
**`String` or `Array<String>`** `void`

One or a list of class names to add to the SVG assets.

#### `consolidate`
**`Boolean` or `String`** `true`

When set to `true`, this will attempt to consolidate reference sheets if multiple usages of Savager are used on the page. When set to a `String`, it will be the `id` of the single reference sheet on the page after consolidation. Setting to `false` will not consolidate reference sheets.

#### `externalPath`
**`Boolean` or `String`** `void`

If your assets are hosted externally (eg. CDN), you can provide the path to the assets here. Using this will not return a `sheet` resource when preparing assets.

#### `toSvgElement`
**`Boolean` or `Function`** `false`

When providing a function, the input will be SVG asset string which may transform into an element for the needs of your app. When providing `true`, it wil use a default render function to return valid `SVGElement` nodes.

---
### `injectionInit`
This is an additional export that is provided to help when injection is required but assets are prepared on the server. It is the same function provided when using the `attemptInject` option. You can individually require the injection function independent of using an instance using this technique.

```js
const { injectionInit } = require('savager');
```

---

### `getAssets(assetNames, options)`

This is a slimmer version of the `prepareAssets()` method on the `Savager` instance. It can be helpful when you've prepared your reference sheet in one part of the app lifecycle but need to generate the assets at another time without needing to import the `symbols` and instanciate another instance.

This function will not provide a reference sheet, only the `assets` and `inject` (if requested).

The `consolidate` and `autoAppend` options do nothing here as there is no reference sheet to work with.

```js
const { getAssets } = require('savager');

const { assets } = getAssets(['balloon', 'paperclip'], { externalPath: 'path/to/assets' });
console.log(assets.balloon); // <svg><use href="path/to/assets/balloon.svg#balloon"></svg>
console.log(assets.paperclip); // <svg><use href="path/to/assets/paperclip.svg#paperclip"></svg>
```

---

### `createSymbols(pathOrObject)`

This method takes a single argument, either a path to SVG files or an object where the keys are asset names (used for look up) and the value is a SVG XML string (`<svg></svg>`). When using the directory path, the file name will become the asset name.

This method is also available as a named export from the package. You can use this if you have your own processing step before preparing the SVG files, perhaps with something like [SVGO](https://github.com/svg/svgo).

```js
const { createSymbols } = require('savager');

createSymbols('path/to/svg').then((savagerSymbols) => console.log(savagerSymbols));
/* { balloon: '<svg><symbol>...</symbol></svg>' } */
```

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

The above will create new `.svg` assets in the `app/static/assets` directory along with a `manifest.js` file, written with ES Module syntax. You can move the `manifest.js` file elsewhere in the app depending on how you intend to use the project as it is needed to initialize a `new Savager()` instance.
