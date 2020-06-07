const iife = (function consolidate(currentSheetId) {
  const masterSheetId = 'savager-mastersheet';
  const currentSheet = document.getElementById(currentSheetId);
  let masterSheet = document.getElementById(masterSheetId);
  if (!masterSheet) {
    masterSheet = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    masterSheet.id = masterSheetId;
    masterSheet.style.display = 'none';
    document.body.appendChild(masterSheet);
  }
  Array.prototype.slice.call(currentSheet.querySelectorAll('symbol')).forEach((symbol) => masterSheet.appendChild(symbol));
  currentSheet.remove();
}).toString();

export default class Savager {
  constructor(symbols, options) {
    this._symbols = {};
    this._externalUrl = '';
    const { externalUrl } = options || {};
    this.storeSymbols(symbols).setExternalUrl(externalUrl);
  }

  prepareAssets(assetNames, options) {
    console.log(this);
    const { external, autoappend, consolidate, classNames } = options || {};
    const className = `class="${[].concat(classNames).filter(Boolean).join(' ')}"`;

    const svgAssets = [].concat(assetNames).reduce(function collectAssets(assets, assetName) {
      let url = `#${assetName}`;
      let attr = 'internal';
      if (external) {
        url = `${this._externalUrl}${assetName}.svg` + url;
        attr = 'external';
      }
      const svg = `<svg ${className} ${attr}><use xlink:href="${url}"/></svg>`;
      return Object.assign(assets, { [assetName]: svg });
    }, {});

    const symbols = this._symbols;
    let assetSheet = Object.keys(svgAssets).reduce(function unwrapSvg(sheet, assetName) {
      return symbols && symbols[assetName]
        ? sheet + symbols[assetName].replace(/<\/?svg ?[^>]*>/gmi, '')
        : sheet
    }, '');

    if (assetSheet) {
      const { sheet, script } = completeAssetSheet(assetSheet, consolidate);
      const isBrowser = typeof document !== 'undefined' && document.createElement;
      if (isBrowser && autoappend && !external) {
        const inject = (typeof consolidate !== 'boolean' || consolidate) && script;
        autoAppend(sheet, inject);
      }
  
      return {
        assets: svgAssets,
        sheet,
      }
    }

    return { assets: svgAssets };
  }

  storeSymbols(symbols) {
    this._symbols = Object.assign({}, this._symbols, symbols);
    return this;
  }

  setExternalUrl(url) {
    if (url) {
      this._externalUrl = url;
    }
    return this;
  }
}

function autoAppend(sheet, script) {
  const frag = document.createDocumentFragment();
  const sheetTemplate = document.createElement('template');
  sheetTemplate.innerHTML = sheet;
  frag.appendChild(sheetTemplate.content);

  if (script) {
    const s = document.createElement('script');
    s.setAttribute('autoappend', '');
    s.appendChild(document.createTextNode(script))
    frag.appendChild(s);
  }
  document.body.append(frag);
}

function completeAssetSheet(symbols, consolidate) {
  const falseAttr = 'consolidate="false"';
  const id = `savager-${Math.random().toString(36).substr(2, 9)}`;
  const attrs = `id="${id}" xmlns="http://www.w3.org/2000/svg" style="display:none;" ${falseAttr}`;
  const script = `(${iife})('${id}')`;
  const consolidateScript = `<script type="text/javascript">${script}</script>`;
  const svg = `<svg ${attrs}>${symbols}${consolidateScript}</svg>`;
  const sheet = consolidate === false ? svg.replace(consolidateScript, '') : svg.replace(falseAttr, '');
  return {
    sheet,
    script,
  };
}