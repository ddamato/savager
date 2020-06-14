import savagerSymbols from './assets/manifest.js';
import Savager from './savager/savager.esm.js';

const savager = new Savager(savagerSymbols);

const pageAssets = savager.prepareAssets('savager-logo', { toSvgElement: true, autoAppend: true });
const logo = pageAssets.assets['savager-logo'].cloneNode(true);
logo.firstElementChild.classList.add('savager-logo');

const h1 = document.querySelector('h1');
h1.innerText = '';
h1.appendChild(logo);