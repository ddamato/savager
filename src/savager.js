import getAssets from './getAssets.js';
import consolidateSheet from './consolidateSheet.js';
import toSvgElementFn from './toSvgElement.js';

export default class Savager {
  constructor(symbols, options) {
    this._symbols = {};
    this._options = Object.assign({}, options);
    this.storeSymbols(symbols);
  }

  prepareAssets(assetNames, options) {
    const { 
      consolidate,
      autoAppend,
      ...getAssetsOptions
    } = Object.assign((options || {}), this._options);

    let renderFn = (svgString) => svgString;
    if (getAssetsOptions.toSvgElement) {
      renderFn = typeof getAssetsOptions.toSvgElement === 'function' ? getAssetsOptions.toSvgElement : toSvgElementFn;
    }

    const resources = getAssets(assetNames, getAssetsOptions);

    const assetSheetOptions = {
      prepareConsolidation: typeof consolidate === 'undefined' || Boolean(consolidate),
    }

    if (assetSheetOptions.prepareConsolidation) {
      assetSheetOptions.primarySheetId = typeof consolidate === 'string'
        ? consolidate.toString() 
        : 'savager-primarysheet';
    }

    const symbols = this._symbols;
    let assetSheet = Object.keys(resources.assets).reduce(function unwrapSvg(sheet, assetName) {
      return symbols && symbols[assetName]
        ? sheet + symbols[assetName].replace(/<\/?svg ?[^>]*>/gmi, '')
        : sheet
    }, '');

    if (assetSheet && !getAssetsOptions.externalPath) {
      const { sheet } = completeAssetSheet(assetSheet, assetSheetOptions);
      resources.sheet =  renderFn(sheet);
      if (autoAppend) {
        appendSheet(sheet);
      }
    }

    return resources;
  }

  storeSymbols(symbols) {
    this._symbols = Object.assign({}, this._symbols, symbols);
    return this;
  }
}

function completeAssetSheet(symbols, options) {
  const { prepareConsolidation, primarySheetId } = options;
  const id = `savager-${Math.random().toString(36).substr(2, 9)}`;
  const attrs = `id="${id}" xmlns="http://www.w3.org/2000/svg" style="display:none;"`;
  let script = '';
  if (prepareConsolidation) {
    const iife = `(${consolidateSheet.toString()})('${id}', '${primarySheetId}')`.replace(/\"/g, `'`);
    script = `<image href="#" onerror="${iife}"/>`;
  }
  const sheet = `<svg ${attrs}>${script}${symbols}</svg>`;
  return { sheet };
}

function appendSheet(sheet) {
  if (typeof document !== 'undefined' && document.createElement) {
    document.body.appendChild(toSvgElementFn(sheet));
  } else {
    throw new Error('Attempted to autoAppend without browser context');
  }
}