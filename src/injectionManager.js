import { WINDOW_FN_REFERENCE } from './injectionAssets.js';

export default function () {
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
      [...svg.attributes].forEach(({ name, value }) => clone.setAttribute(name, value));
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
        [...symbol.attributes].forEach(({ name, value }) =>svg.setAttribute(name, value));
      return svg;
    }
  }

  if (typeof window !== 'undefined') {
    window[WINDOW_FN_REFERENCE] = new InjectionManager();
  }
}
