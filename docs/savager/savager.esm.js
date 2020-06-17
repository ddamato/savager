var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, basedir, module) {
	return module = {
	  path: basedir,
	  exports: {},
	  require: function (path, base) {
      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    }
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var urlJoin = createCommonjsModule(function (module) {
(function (name, context, definition) {
  if ( module.exports) module.exports = definition();
  else context[name] = definition();
})('urljoin', commonjsGlobal, function () {

  function normalize (strArray) {
    var resultArray = [];
    if (strArray.length === 0) { return ''; }

    if (typeof strArray[0] !== 'string') {
      throw new TypeError('Url must be a string. Received ' + strArray[0]);
    }

    // If the first part is a plain protocol, we combine it with the next part.
    if (strArray[0].match(/^[^/:]+:\/*$/) && strArray.length > 1) {
      var first = strArray.shift();
      strArray[0] = first + strArray[0];
    }

    // There must be two or three slashes in the file protocol, two slashes in anything else.
    if (strArray[0].match(/^file:\/\/\//)) {
      strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, '$1:///');
    } else {
      strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, '$1://');
    }

    for (var i = 0; i < strArray.length; i++) {
      var component = strArray[i];

      if (typeof component !== 'string') {
        throw new TypeError('Url must be a string. Received ' + component);
      }

      if (component === '') { continue; }

      if (i > 0) {
        // Removing the starting slashes for each component but the first.
        component = component.replace(/^[\/]+/, '');
      }
      if (i < strArray.length - 1) {
        // Removing the ending slashes for each component but the last.
        component = component.replace(/[\/]+$/, '');
      } else {
        // For the last component we will combine multiple slashes to a single one.
        component = component.replace(/[\/]+$/, '/');
      }

      resultArray.push(component);

    }

    var str = resultArray.join('/');
    // Each input component is now separated by a single slash except the possible first plain protocol part.

    // remove trailing slash before parameters or hash
    str = str.replace(/\/(\?|&|#[^!])/g, '$1');

    // replace ? in parameters with &
    var parts = str.split('?');
    str = parts.shift() + (parts.length > 0 ? '?': '') + parts.join('&');

    return str;
  }

  return function () {
    var input;

    if (typeof arguments[0] === 'object') {
      input = arguments[0];
    } else {
      input = [].slice.call(arguments);
    }

    return normalize(input);
  };

});
});

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

const WINDOW_FN_REFERENCE = 'svgInjectionManager';
const INJECTION_ANIMATION_NAME = 'nodeDetected';
const injectionString = `window.${WINDOW_FN_REFERENCE} && window.${WINDOW_FN_REFERENCE}.replace(this)`;

const injectionStyle = `<style>@keyframes ${INJECTION_ANIMATION_NAME} { to { opacity: 1; } }</style>`;
const injectionAttrs = {
  style: `animation: ${INJECTION_ANIMATION_NAME} .1ms`,
  onanimationstart: injectionString,
  onerror: injectionString,
};

function injectionInit () {
  class InjectionManager {
    constructor() {
      this._registrar = {};
    }

    get(id) {
      return this._registrar[id];
    }

    replace(useNode) {
      const { url, exposure, id } = this._parseNode(useNode);
      const node = this.get(id);
      if (node) {
        return Promise.resolve(this._replace(useNode, id));
      }

      if (exposure === "internal") {
        const root = useNode.getRootNode();
        const rootReference = root.getElementById(id);
        if (rootReference) {
          return Promise.resolve(
            "Reference found in root, replacement halted."
          );
        }
        return this._embedInternal(useNode, { id });
      }

      if (exposure === "external") {
        return this._embedExternal(useNode, { id, url });
      }

      return Promise.reject(
        "Could not find asset reference. Ensure the reference sheet or external url exist before executing this script"
      );
    }

    _replace(useNode, id) {
      const node = this.get(id);
      const clone = node.cloneNode(true);
      clone.removeAttribute("id");
      clone.setAttribute("replaced", "");
      const svg = useNode.parentNode;
      [...svg.attributes].forEach(({ name, value }) =>
        clone.setAttribute(name, value)
      );
      svg.replaceWith(clone);
      return clone;
    }

    register(useNode, id, elem) {
      this._registrar[id] = elem;
      return this._replace(useNode, id);
    }

    _embedInternal(useNode, { id }) {
      const symbolReference = document.getElementById(id);
      if (symbolReference) {
        const symbol = symbolReference.cloneNode(true);
        return Promise.resolve(
          this.register(useNode, id, this._transformSymbol(symbol))
        );
      }
      return Promise.reject(`Symbol "${id}" not found in document.`);
    }

    _embedExternal(useNode, { id, url }) {
      return window
        .fetch(url)
        .then((res) => res.text())
        .then((text) => {
          const dom = new DOMParser().parseFromString(text, "image/svg+xml");
          const symbol = dom.querySelector("symbol");
          if (symbol) {
            return this.register(useNode, id, this._transformSymbol(symbol));
          }
          throw new Error(
            `Malformed external reference, please ensure <symbol/> assets.`
          );
        })
        .catch((err) => console.error(err));
    }

    _parseNode(useNode) {
      const url = useNode.getAttribute("href");
      if (!url) {
        return {};
      }
      const [filepath, id] = url.split("#");
      let exposure = useNode.getAttribute("exposure");
      if (!exposure) {
        exposure = Boolean(filepath) ? "external" : "internal";
      }
      return { url, exposure, id };
    }

    _transformSymbol(symbol) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      symbol.children &&
        [...symbol.children].forEach((child) => svg.appendChild(child));
      symbol.hasAttributes() &&
        [...symbol.attributes].forEach(({ name, value }) =>
          svg.setAttribute(name, value)
        );
      return svg;
    }
  }

  if (typeof window !== 'undefined') {
    window[WINDOW_FN_REFERENCE] = new InjectionManager();
  }
}

function getAssets(assetNames, options) {
  const { 
    externalPath,
    attemptInject,
    classNames,
    toSvgElement,
  } = options || {};
  const primarySvgAttrs = { xmlns: 'http://www.w3.org/2000/svg' };

  const resources = {};

  if (attemptInject) {
    resources.inject = injectionInit;
  }

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

    if (typeof externalPath === 'string') {
      svgAttrs.exposure = 'external';
      useAttrs.href = urlJoin(externalPath, `${assetName}.svg`, useAttrs.href);
    }

    let style = '';
    if (attemptInject) {
      style = injectionStyle;
      useAttrs = Object.assign(useAttrs, injectionAttrs);
    }

    const svgString = `<svg ${toAttributes(svgAttrs)}>${style}<use ${toAttributes(useAttrs)}/></svg>`;
    return Object.assign(assets, { [assetName]: svgString });
  }, {});

  resources.assets = Object.entries(svgAssets).reduce(function renderAssets(acc, [name, svgString]) {
    return Object.assign(acc, { [name]: renderFn(svgString) });
  }, {});

  return resources;
}

function toAttributes(obj) {
  return Object.entries(obj).map(([ name, value ]) => `${name}="${value}"`).join(' ');
}

function consolidateSheet (currentSheetId, masterSheetId) {
  const currentSheet = document.getElementById(currentSheetId);
  if (!currentSheet) {
    return;
  }

  if (!masterSheetId) {
    masterSheetId = 'savager-primarysheet';
  }

  let masterSheet = document.getElementById(masterSheetId);
  if (!masterSheet) {
    masterSheet = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    masterSheet.id = masterSheetId;
    masterSheet.style.display = 'none';
    document.body.appendChild(masterSheet);
  }

  Array.prototype.slice.call(currentSheet.querySelectorAll('symbol')).forEach((symbol) => {
    !masterSheet.getElementById(symbol.id) && masterSheet.appendChild(symbol);
  });
  currentSheet.remove();
}

class Savager {
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
    };

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

async function createSymbols(pathOrObject) {

  if (typeof pathOrObject === 'string') {
    if (typeof window !== 'undefined' || !require) {
      throw new Error('Can only create symbols using path within node environment.');
    }

    const path = require('path');
    const fs = require('fs');

    try {
      const files = await fs.promises.readdir(pathOrObject);
      const sources = await Promise.all(files.map(async (file) => {
        const fileName = path.parse(file).name;
        const source = await fs.promises.readFile(path.resolve(pathOrObject, file));
        return { [fileName]: source.toString() };
      }));
      const flattened = sources.reduce(( acc, source ) => Object.assign(acc, source), {});
      return createSymbols(flattened);
    } catch (err) {
      throw new Error(err);
    }
  } else if (typeof pathOrObject === 'object') {
    return Object.entries(pathOrObject).reduce((symbols, [name, svg]) => Object.assign(symbols, { [name]: toSymbol(svg, name) }), {});
  } else {
    throw new Error('Unknown argument provided. Must be an object or path to files.', pathOrObject);
  }

}

function toSymbol(svgString, name) {
  let namespace = 'xmlns="http://www.w3.org/2000/svg"';
  const asSymbol = svgString.replace(/(xmlns=.[^"']+)./gmi, (match) => {
    namespace = match; return ''; // Capture namespace if it exists
  })
  .replace(/(<\/?)svg/gmi, '$1symbol') // Replace 'svg' tag name with 'symbol'
  .replace(/<symbol/, `<symbol id="${name}"`); // Include the id
  return `<svg ${namespace}>${asSymbol}</svg>`
    .replace(/\r?\n|\r|/g, '') // Remove unnecssary linebreaks
    .replace(/ {2,}/g, ' '); // Remove unnecssary whitespace
}

const Savager$1 = Savager;

export default Savager;
export { Savager$1 as Savager, createSymbols, getAssets, injectionInit };
