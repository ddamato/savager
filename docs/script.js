import savagerSymbols from './symbols.js';
import Savager from './savager/savager.esm.js';

window.svgInjectionManager = {
  replace: (node) => console.log(node)
}

const options =  { classNames: 'savager-svg', toElement: true, inject: true };
const savager = new Savager(savagerSymbols, options);
const { assets, sheet } = savager.prepareAssets(['bang-triangle', 'clock-reverse']);

document.body.appendChild(sheet);
const inventory = document.querySelector('.inventory');
Object.entries(assets).forEach(([name, elem]) => {
  const li = document.createElement('li');
  inventory.appendChild(li);
  li.dataset.name = name;
  li.appendChild(elem);
});