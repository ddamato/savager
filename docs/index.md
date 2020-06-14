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

The assets created should be the ones hosted externally. Savager will then construct the urls based on the `externalUrl` option provided. It's probably best to set this in the constructor options.

```js
import Savager from 'savager';
import symbols from './manifest.js';

const SVG_CDN_URL = 'https://assets.cdn.com/path/to/assets';
const savager = new Savager(symbols, { externalUrl: SVG_CDN_URL });
```

## Internal Assets
If you aren't hosting assets externally, you'll need to include a reference sheet on the page. You can let the `prepareAssets()` method attempt to append it to the `document.body`:

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

## Examples

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

### Auto appending the sheet
Adding the reference sheet can be easier when running in a browser context.
```js
/* Reference sheet is automatically appended to the document.body */
const options = { autoAppend: true };
const { assets } = savager.prepareAssets('bang-triangle');

/* Set the innerHTML of an existing element */
const mySvg = document.querySelector('.mySvg.autoAppendExample');
mySvg.innerHTML = assets['bang-triangle'];
```

### Assets as document fragment
When using this method, it must be run in a browser context to create the DOM Element. Running this server-side will throw an error.
```js
/* Create a document fragment for each asset, automatically append reference sheet */
const options = { toSvgElement: true, autoAppend: true };
const { assets } = savager.prepareAssets('bang-triangle', options);

/* Append the svg to an existing element */
const mySvg = document.querySelector('.mySvg.documentFragmentExample');
mySvg.appendChild(assets['bang-triangle']);
```

### Adding class names to the assets
You can provide a single string or an array of strings.
```js
/* Add the 'exampleClass-svg' class to each svg, automatically append reference sheet */
const options = { classNames: 'exampleClass-svg', autoAppend: true };
const { assets } = savager.prepareAssets('bang-triangle', options);

/* Set the innerHTML of an existing element */
const mySvg = document.querySelector('.mySvg.classNameExample');
mySvg.innerHTML = assets['bang-triangle'];
```