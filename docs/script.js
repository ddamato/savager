import savagerSymbols from './assets/manifest.js';
import Savager from './savager/savager.esm.js';

const savager = new Savager(savagerSymbols, { consolidate: false });

function setH1Logo() {
  const pageAssets = savager.prepareAssets('savager-logo', { autoAppend: true, classNames: 'savager-logo' });
  const h1 = document.querySelector('h1');
  h1.innerHTML = pageAssets.assets['savager-logo'];
}

setH1Logo();

function innerHtmlExample() {
  const { assets, sheet } = savager.prepareAssets('bang-triangle');

  /* Add the reference sheet to the page */
  const sheetContainer = document.createElement('div');
  sheetContainer.innerHTML = sheet;
  document.body.appendChild(sheetContainer);

  /* Set the innerHTML of an existing element */
  const mySvg = document.querySelector('.mySvg.innerHtmlExample');
  mySvg.innerHTML = assets['bang-triangle'];
}

innerHtmlExample();

function autoAppendExample() {
  /* Reference sheet is automatically appended to the document.body */
  const options = { autoAppend: true };
  const { assets } = savager.prepareAssets('bars-horizontal', options);

  /* Set the innerHTML of an existing element */
  const mySvg = document.querySelector('.mySvg.autoAppendExample');
  mySvg.innerHTML = assets['bars-horizontal'];
}

autoAppendExample();

function documentFragmentExample() {
  /* Create a document fragment for each asset, automatically append reference sheet */
  const options = { toSvgElement: true, autoAppend: true };
  const { assets } = savager.prepareAssets('caret-down', options);

  /* Append the svg to an existing element */
  const mySvg = document.querySelector('.mySvg.documentFragmentExample');
  mySvg.appendChild(assets['caret-down']);
}

documentFragmentExample();

function classNameExample() {
  /* Add the 'example-extraLarge' class to each svg, automatically append reference sheet */
  const options = { classNames: 'example-extraLarge', autoAppend: true };
  const { assets } = savager.prepareAssets('clock-reverse', options);

  /* Set the innerHTML of an existing element */
  const mySvg = document.querySelector('.mySvg.classNameExample');
  mySvg.innerHTML = assets['clock-reverse'];
}

classNameExample();

function externalPathExample() {
  /* Include the path to the assets */
  const options = { externalPath: 'assets' };
  const { assets } = savager.prepareAssets('code-brackets', options);

  /* Set the innerHTML of an existing element */
  const mySvg = document.querySelector('.mySvg.externalPathExample');
  mySvg.innerHTML = assets['code-brackets'];
}

externalPathExample();