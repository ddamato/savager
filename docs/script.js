import savagerSymbols from './symbols.js';
import Savager from './savager/savager.esm.js';

const savager = new Savager(savagerSymbols);
const options =  { autoappend: true, classNames: 'savager-svg', toElement: true };
const { assets } = savager.prepareAssets(['bang-triangle', 'clock-reverse'], options);

const inventory = document.querySelector('.inventory');
Object.entries(assets).forEach(([name, elem]) => {
  const li = document.createElement('li');
  inventory.appendChild(li);
  li.dataset.name = name;
  li.appendChild(elem);
});