
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

    const inShadowDOM = useNode.getRootNode({ composed:true }) !== useNode.getRootNode();
    if (exposure === 'internal') {
      if (inShadowDOM) {
        return this._fetchInternal(useNode, { id });
      }
      return Promise.resolve('Asset found in document'); // Ask to skip or force?
    }

    if (exposure === 'external') {
      return this._fetchExternal(useNode, { id, url });
    }

    return Promise.reject('Could not find reference to replace node. Ensure the reference sheet or external url exist before executing this script');
  }

  _replace(useNode, id) {
    const node = this.get(id);
    if (node) {
      const clone = node.cloneNode(true)
      useNode.parentNode.replaceWith(clone);
      return clone;
    }
  }

  register(useNode, id, elem) {
    this._registrar[id] = elem;
    return this._replace(useNode, id);
  }

  _fetchInternal(useNode, { id }) {
    const symbolReference = document.getElementById(id);
    if (symbolReference) {
      const symbol = symbolReference.cloneNode(true);
      return Promise.resolve(this.register(useNode, id, this._transformSymbol(symbol)));
    }
    return Promise.reject(`Symbol (${id}) not found in document`);
  }

  _fetchExternal(useNode, { id, url }) {
    return fetch(url).then((res) => res.text()).then((text) => {
      const dom = new DOMParser().parseFromString(text, 'image/svg+xml');
      const symbol = dom.querySelector('symbol');
      if (symbol && symbol.children.length === 1) {
        return this.register(useNode, id, this._transformSymbol(symbol));
      }
      throw new Error(`Malformed external reference, please ensure '<symbol/>' assets`);
    }).catch((err) => console.error(err));
  }

  _parseNode(useNode) {
    const url = useNode.getAttribute('href');
    const [ filepath, id ] = url.split('#');
    let exposure = useNode.getAttribute('exposure');
    if (!exposure) {
      exposure = Boolean(filepath) ? 'external' : 'internal';
    }
    return { url, exposure, id };
  }

  _transformSymbol(symbol) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.append(symbol.children);
    symbol.hasAttributes() && [...symbol.attributes].forEach(({ name, value }) => svg.setAttribute(name, value));
    return svg;
  }
}

const WINDOW_FN_REFERENCE = 'svgInjectionManager';

export default {
  injectionString: `window.${WINDOW_FN_REFERENCE} && window.${WINDOW_FN_REFERENCE}.replace(this)`,
  injectionScript: () => {
    if (typeof window !== 'undefined') {
      window[WINDOW_FN_REFERENCE] = new InjectionManager();
      return window[WINDOW_FN_REFERENCE];
    }
  },
}
