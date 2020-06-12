import savagerSymbols from './assets/symbols.js';
import Savager from './savager/savager.esm.js';

const options = { classNames: 'savager-svg', toSvgElement: true, autoAppend: true };
const savager = new Savager(savagerSymbols);

const pageAssets = savager.prepareAssets('savager-logo', { toSvgElement: true, autoAppend: true });
const logo = pageAssets.assets['savager-logo'].cloneNode(true);
logo.firstElementChild.classList.add('savager-logo');

const h1 = document.querySelector('h1');

h1.appendChild(logo);

const { assets, sheet, inject } = savager.prepareAssets(['bang-triangle', 'clock-reverse'], options);

if (sheet && !options.autoAppend) {
  document.body.appendChild(sheet);
}

if (typeof inject === 'function') {
  inject();
}

const inventory = document.querySelector('.inventory');
Object.entries(assets).forEach(([name, elem]) => {
  const li = document.createElement('li');
  inventory.appendChild(li);
  li.dataset.name = name;
  li.appendChild(elem);
});