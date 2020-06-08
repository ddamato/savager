// import consolidateSheet from './consolidateSheet.js';
// const consolidateFnString = consolidateSheet.toString();
const WINDOW_FN_CALL = 'window.svgInjectionManager && window.svgInjectionManager.replace(this)';

export default class Savager {
  constructor(symbols, options) {
    this._symbols = {};
    this._options = Object.assign({}, options);
    this.storeSymbols(symbols);
  }

  prepareAssets(assetNames, options) {
    const { externalUrl, inject, classNames, toElement } = options || this._options;
    const className = classNames ? `class="${[].concat(classNames).filter(Boolean).join(' ')}"` : '';
    let renderFn = (svgString) => svgString;

    if (toElement) {
      renderFn = typeof toElement === 'function' ? toElement : toElementFn;
    }

    const svgAssets = [].concat(assetNames).reduce(function collectAssets(assets, assetName) {
      const useAttrs = {
        href: `#${assetName}`
      }

      let exposure = 'internal';
      if (externalUrl) {
        useAttrs.href = `${typeof externalUrl === 'string' ? externalUrl : ''}${assetName}.svg` + useAttrs.href;
        exposure = 'external';
      }

      let style = ''
      if (inject) {
        style = '<style>@keyframes nodeInserted { to { opacity: 1; } }</style>';
        useAttrs.style = 'animation: nodeInserted .1ms';
        useAttrs.onanimationstart = WINDOW_FN_CALL;
        useAttrs.onerror = WINDOW_FN_CALL;
      }

      const svgAttrsString = [className, exposure].filter(Boolean).join(' ');
      const useAttrString = Object.entries(useAttrs).map(([ name, value ]) => `${name}="${value}"`).join(' ');

      const svgString = `<svg ${svgAttrsString}>${style}<use ${useAttrString}/></svg>`;
      return Object.assign(assets, { [assetName]: svgString });
    }, {});

    const symbols = this._symbols;
    let assetSheet = Object.keys(svgAssets).reduce(function unwrapSvg(sheet, assetName) {
      return symbols && symbols[assetName]
        ? sheet + symbols[assetName].replace(/<\/?svg ?[^>]*>/gmi, '')
        : sheet
    }, '');

    const assets = Object.entries(svgAssets)
      .reduce((acc, [name, svgString]) => Object.assign(acc, { [name]: renderFn(svgString) }), {});

    if (assetSheet && !externalUrl) {
      const { sheet } = completeAssetSheet(assetSheet);
      return { assets, sheet: renderFn(sheet) };
    }

    return { assets };
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

function toElementFn(htmlString) {
  if (typeof document !== 'undefined' && document.createElement) {
    const tmpl = document.createElement('template');
    tmpl.innerHTML = htmlString;
    return tmpl.content;
  }
  return htmlString;
}