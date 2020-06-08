import savagerSymbols from './symbols.js';
import Savager from './savager/savager.esm.js';

const options =  { classNames: 'savager-svg', toElement: true, inject: true };
const savager = new Savager(savagerSymbols, options);
const { assets, sheet, injectionScript } = savager.prepareAssets(['bang-triangle', 'clock-reverse']);

if (sheet) {
  document.body.appendChild(sheet);
}

injectionScript();

const inventory = document.querySelector('.inventory');
Object.entries(assets).forEach(([name, elem]) => {
  const li = document.createElement('li');
  inventory.appendChild(li);
  li.dataset.name = name;
  li.appendChild(elem);
});