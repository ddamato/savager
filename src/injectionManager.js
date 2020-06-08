
class InjectionManager {
  constructor() {
    this._registry = {};
  }

  get(id) {
    return this._registry[id];
  }

  replace(useNode) {
    const { url, exposure, id } = this._parseNode(useNode);
    const node = this.get(id);
    if (node) {
      return this._replace(useNode, id);
    }

    const inShadowDOM = useNode.getRootNode({ composed:true }) !== useNode.getRootNode();
    if (exposure === 'internal' && inShadowDOM) {
      return this._fetchInternal(useNode, { id });
    }

    if (exposure === 'external') {
      return this._fetchExternal(useNode, { id, url });
    }
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
    this._registry[id] = elem;
    return this._replace(useNode, id);
  }

  _fetchInternal(useNode, { id }) {
    const symbolReference = document.getElementById(id);
    if (symbolReference) {
      const symbol = symbolReference.cloneNode(true);
      return this.register(useNode, id, transformSymbol(symbol));
    } else {
      console.error(`Symbol (${id}) not found in document`);
    }
  }

  _fetchExternal(useNode, { id, url }) {
    return fetch(url).then((res) => res.text()).then((text) => {
      const symbol = new DOMParser().parseFromString(text, 'image/svg+xml');
      return this.register(useNode, id, transformSymbol(symbol));
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

