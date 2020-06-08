import consolidateSheet from './consolidateSheet.js';
import urljoin from 'url-join';
import { injectionStyle, injectionAttrs, injectionScript } from './injectionManager.js';

export default class Savager {
  constructor(symbols, options) {
    this._symbols = {};
    this._options = Object.assign({}, options);
    this.storeSymbols(symbols);
  }

  prepareAssets(assetNames, options) {
    const { externalUrl, inject, classNames, toSvgElement, consolidate } = options || this._options;
    const primarySvgAttrs = { xmlns: 'http://www.w3.org/2000/svg' };
    const prepareConsolidation = typeof consolidate === 'undefined' || Boolean(consolidate);
    const resources = {
      inject: inject ? injectionScript : Function.prototype,
    };

    if (classNames) {
      primarySvgAttrs.class = [].concat(classNames).filter(Boolean).join(' ');
    }

    let renderFn = (svgString) => svgString;
    if (toSvgElement) {
      renderFn = typeof toSvgElement === 'function' ? toSvgElement : toSvgElementFn;
    }

    const svgAssets = [].concat(assetNames).reduce(function collectAssets(assets, assetName) {
      const svgAttrs = Object.assign({ exposure: 'internal' }, primarySvgAttrs);
      let useAttrs = { href: `#${assetName}` };

      if (externalUrl) {
        svgAttrs.exposure = 'external';
        const baseExternalUrl = typeof externalUrl === 'string' ? externalUrl : '';
        useAttrs.href = urljoin(baseExternalUrl, `${assetName}.svg`, useAttrs.href);
      }

      let style = ''
      if (inject) {
        style = injectionStyle;
        useAttrs = Object.assign(useAttrs, injectionAttrs);
      }

      const svgString = `<svg ${toAttributes(svgAttrs)}>${style}<use ${toAttributes(useAttrs)}/></svg>`;
      return Object.assign(assets, { [assetName]: svgString });
    }, {});

    const symbols = this._symbols;
    let assetSheet = Object.keys(svgAssets).reduce(function unwrapSvg(sheet, assetName) {
      return symbols && symbols[assetName]
        ? sheet + symbols[assetName].replace(/<\/?svg ?[^>]*>/gmi, '')
        : sheet
    }, '');

    resources.assets = Object.entries(svgAssets).reduce(function renderAssets(acc, [name, svgString]) {
      return Object.assign(acc, { [name]: renderFn(svgString) });
    }, {});

    if (assetSheet && !externalUrl) {
      const { sheet } = completeAssetSheet(assetSheet, prepareConsolidation);
      console.log('str', sheet);
      resources.sheet =  renderFn(sheet);
      console.log('elem', resources.sheet);
    }

    return resources;
  }

  storeSymbols(symbols) {
    this._symbols = Object.assign({}, this._symbols, symbols);
    return this;
  }
}

function completeAssetSheet(symbols, consolidate) {
  const id = `savager-${Math.random().toString(36).substr(2, 9)}`;
  const attrs = `id="${id}" xmlns="http://www.w3.org/2000/svg" style="display:none;"`;
  let script = '';
  if (consolidate) {
    const iife = `(${consolidateSheet.toString()})('${id}')`.replace(/\"/g, `'`);
    script = `<image href="#" onerror="${iife}"/>`;
  }
  const sheet = `<svg ${attrs}>${script}${symbols}</svg>`;
  return { sheet };
}

function toAttributes(obj) {
  return Object.entries(obj).map(([ name, value ]) => `${name}="${value}"`).join(' ');
}

let elem;
function toSvgElementFn(svgString) {
  if (typeof document !== 'undefined' && document.createElement) {
    if (!elem) {
      elem = document.createElement('div');
    }
    elem.innerHTML = svgString;
    const frag = document.createDocumentFragment();
    [...elem.children].forEach((child) => frag.appendChild(child));
    return frag;
  }
  return svgString;
}