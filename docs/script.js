import savagerSymbols from './symbols.js';
import Savager from './savager/savager.esm.js';

const savager = new Savager(savagerSymbols);
const { assets } = savager.prepareAssets(['bang-triangle'], { autoappend: true });
