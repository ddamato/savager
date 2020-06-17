# Savager

## Getting Started

Install the package into your project

```bash
npm i savager
```

Run the `create-symbols` script against your SVG files.

```bash
create-symbols -i svg -o assets -t esm
```

Then import `Savager` and the symbols into your build script. The `assets` output will contain your new SVG markup!

```js
import Savager from 'savager';
import symbols from './manifest.js';

const savager = new Savager(symbols);
const { assets, sheet } = savager.prepareAssets('balloon');
document.body.innerHTML = assets.balloon;
```

## External Assets
When hosting assets externally, they should still be processed first by the `create-symbols` script. The script will create a manifest which the `Savager` instance uses to prepare assets.

```js
import Savager from 'savager'; /* The constructor */
import symbols from './manifest.js'; /* manifest.js, created from the `create-symbols` script */
```

The assets created should be the ones hosted externally. Savager will then construct the urls based on the `externalPath` option provided. It's probably best to set this in the constructor options.

```js
import Savager from 'savager';
import symbols from './manifest.js';

const SVG_CDN_PATH = 'https://assets.cdn.com/path/to/assets';
const savager = new Savager(symbols, { externalPath: SVG_CDN_PATH });
```

## Internal Assets
If you aren't hosting assets externally, you'll need to include a reference sheet on the page. You can let the `prepareAssets()` method attempt to append the sheet to the `document.body`:

```js
import Savager from 'savager';
import symbols from './manifest.js';

const savager = new Savager(symbols, { autoAppend: true });
```
This will only work in a browser context. When running the script on a server, you'll need to include the reference sheet in the response and write the returned reference sheet into the HTML:

```js
import nunjucks from 'nunjucks';
import Savager from 'savager';
import symbols from './manifest.js';

const savager = new Savager(symbols);
const { assets, sheet } = savager.prepareAssets('balloon');
const html = nunjucks.render('index.njk', { assets, sheet });
```

The example above uses [Nunjucks](https://mozilla.github.io/nunjucks/) as a templating engine.

## Contingencies
Depending on the method you choose, there may be reasons why the SVG doesn't render.

- When using the [Shadow DOM](https://bitsofco.de/what-is-the-shadow-dom/), referencing by `id` only exists within the root document that the element exists in; it cannot pentrate its search to a parent root document.
- When hosting your assets externally, often it becomes beneficial to host via a [CDN](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/). SVG requests are subject to [CORS](https://www.codecademy.com/articles/what-is-cors). Specifically, attempting to request an SVG resource from a different domain will often be blocked.

Both of these can be resolved using the `attemptInject` option, which will take the referenced asset shape and make a copy to be injected into the node. When preparing the assets, you will also receive a `inject` function which should be executed on the page where the SVGs will appear.

```js
import Savager from 'savager';
import symbols from './manifest.js';

const savager = new Savager(symbols, { attemptInject: true });
const { assets, inject } = savager.prepareAssets('balloon');
```

If you need the `inject` function in a different context from where you prepare assets, you can export it directly from the package. Be sure that when preparing assets, that `attemptInject` option was set to `true`. Otherwise, executing the function will do nothing.

```js
import { injectionInit } from 'savager';
```

## Organization
One method of organizing is to create a `savager.config.js` which you may maintain as your source of truth for SVG assets.

```js
// savager.config.js
import Savager from 'savager';
import symbols from './manifest.js';

export default new Savager(symbols);
```

Then you can prepare assets as needed.

```js
import { prepareAssets } from './savager.config.js';

const { assets, sheet } = prepareAssets('balloon');
```

You may also apply the reference sheet earlier and use the `getAssets` export from the package to render your assets. This function is independent from the `symbols` entered into a `Savager` instance; it just assumes these assets are included in the correct location given the options you provide.

```js
// Assume the reference sheet is on the page
import { getAssets } from 'savager';

const { assets } = getAssets('balloon');
```
Options related to reference sheet management (`consolidate`, `autoAppend`) do not affect these assets.

## Examples

Each one of the examples shows the code after initializing an instance of Savager as well as the output to this page with an SVG.

Reference sheets are automatically consolidated under the `savager-primarysheet` Element by default using `consolidate` option. This consolidates multiple reference sheets found on the page into a single sheet. For the purposes of example, this option has been set to `false` so sheets can be inspected within the page. Consolidation is normally an important step to ensure no `id` is duplicated.

---

### Assets as innerHTML
Creating these assets will return strings. You can export the strings to a render function for templating or just write them as HTML. Remember to add the sheet to the page if the assets are not hosted.
```js
const { assets, sheet } = savager.prepareAssets('bang-triangle');

/* Add the reference sheet to the page */
const sheetContainer = document.createElement('div');
sheetContainer.innerHTML = sheet;
document.body.appendChild(sheetContainer);

/* Set the innerHTML of an existing element */
const mySvg = document.querySelector('.mySvg.innerHtmlExample');
mySvg.innerHTML = assets['bang-triangle'];
```

<div class="mySvg innerHtmlExample"></div>

---

### Auto appending the sheet
Adding the reference sheet can be easier when running in a browser context.
```js
/* Reference sheet is automatically appended to the document.body */
const options = { autoAppend: true };
const { assets } = savager.prepareAssets('bars-horizontal', options);

/* Set the innerHTML of an existing element */
const mySvg = document.querySelector('.mySvg.autoAppendExample');
mySvg.innerHTML = assets['bars-horizontal'];
```

<div class="mySvg autoAppendExample"></div>

---

### Assets as document fragment
When using this method, it must be run in a browser context to create the DOM Element. Running this server-side will throw an error.
```js
/* Create a document fragment for each asset, automatically append reference sheet */
const options = { toSvgElement: true, autoAppend: true };
const { assets } = savager.prepareAssets('caret-down', options);

/* Append the svg to an existing element */
const mySvg = document.querySelector('.mySvg.documentFragmentExample');
mySvg.appendChild(assets['caret-down']);
```

<div class="mySvg documentFragmentExample"></div>

---

### Adding class names to the assets
You can provide a single string or an array of strings.
```js
/* Add the 'example-extraLarge' class to each svg, automatically append reference sheet */
const options = { classNames: 'example-extraLarge', autoAppend: true };
const { assets } = savager.prepareAssets('clock-reverse', options);

/* Set the innerHTML of an existing element */
const mySvg = document.querySelector('.mySvg.classNameExample');
mySvg.innerHTML = assets['clock-reverse'];
```

<div class="mySvg classNameExample"></div>

---

### Referencing external assets
Provide the path to the assets as an option either in the constructor (re: [External Assets](#external-assets)) or in the `prepareAssets()` method. Using external assets does not need a reference sheet to be added in the page.
```js
/* Include the path to the assets */
const options = { externalPath: 'assets' };
const { assets } = savager.prepareAssets('code-brackets', options);

/* Set the innerHTML of an existing element */
const mySvg = document.querySelector('.mySvg.externalPathExample');
mySvg.innerHTML = assets['code-brackets'];
```

<div class="mySvg externalPathExample"></div>
