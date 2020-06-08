import savagerSymbols from './svg/symbols.js';
import Savager from './savager/savager.esm.js';

const options =  { classNames: 'savager-svg', toSvgElement: true, consolidate: false, autoAppend: true };
const savager = new Savager(savagerSymbols, options);
const { assets, sheet, inject } = savager.prepareAssets(['bang-triangle', 'clock-reverse']);

if (sheet && !options.autoAppend) {
  //document.body.appendChild(sheet);
}

inject();

const inventory = document.querySelector('.inventory');
Object.entries(assets).forEach(([name, elem]) => {
  const li = document.createElement('li');
  inventory.appendChild(li);
  li.dataset.name = name;
  li.appendChild(elem);
});