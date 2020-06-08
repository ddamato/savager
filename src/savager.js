// import consolidateSheet from './consolidateSheet.js';
// const consolidateFnString = consolidateSheet.toString();
import urljoin from 'url-join';
import { injectionString, injectionScript } from './injectionManager.js';

export default class Savager {
  constructor(symbols, options) {
    this._symbols = {};
    this._options = Object.assign({}, options);
    this.storeSymbols(symbols);
  }

  prepareAssets(assetNames, options) {
    const { externalUrl, inject, classNames, toElement } = options || this._options;
    const primarySvgAttrs = { xmlns: 'http://www.w3.org/2000/svg' };
    const resources = {
      inject: inject ? injectionScript : Function.prototype,
    };

    if (classNames) {
      primarySvgAttrs.class = [].concat(classNames).filter(Boolean).join(' ');
    }

    let renderFn = (svgString) => svgString;
    if (toElement) {
      renderFn = typeof toElement === 'function' ? toElement : toElementFn;
    }

    const svgAssets = [].concat(assetNames).reduce(function collectAssets(assets, assetName) {
      const svgAttrs = Object.assign({ exposure: 'internal' }, primarySvgAttrs);
      const useAttrs = { href: `#${assetName}` };

      if (externalUrl) {
        svgAttrs.exposure = 'external';
        const baseExternalUrl = typeof externalUrl === 'string' ? externalUrl : '';
        useAttrs.href = urljoin(baseExternalUrl, `${assetName}.svg`, useAttrs.href);
      }

      let style = ''
      if (inject) {
        style = '<style>@keyframes nodeInserted { to { opacity: 1; } }</style>';
        useAttrs.style = 'animation: nodeInserted .1ms';
        useAttrs.onanimationstart = injectionString;
        useAttrs.onerror = injectionString;
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
      const { sheet } = completeAssetSheet(assetSheet);
      resources.sheet =  renderFn(sheet);
    }

    return resources;
  }

  storeSymbols(symbols) {
    this._symbols = Object.assign({}, this._symbols, symbols);
    return this;
  }
}

function completeAssetSheet(symbols) {
  const id = `savager-${Math.random().toString(36).substr(2, 9)}`;
  const attrs = `id="${id}" xmlns="http://www.w3.org/2000/svg" style="display:none;"`;
  const sheet = `<svg ${attrs}>${symbols}</svg>`;
  return { sheet };
}

function toAttributes(obj) {
  return Object.entries(obj).map(([ name, value ]) => `${name}="${value}"`).join(' ');
}

function toElementFn(htmlString) {
  if (typeof document !== 'undefined' && document.createElement) {
    const tmpl = document.createElement('template');
    tmpl.innerHTML = htmlString;
    return tmpl.content;
  }
  return htmlString;
}