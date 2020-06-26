import { WINDOW_FN_REFERENCE } from './injectionAssets.js';

/**
 * This anon function (imported elsewhere as injectionInit) is expected to execute on a page where assets are to be injected. It can be stringified and turned into an iife for templating purposes. `(${injectionInit.toString()})()`;
 */
export default function injectionInit() {
  class InjectionManager {

    /**
     * Creates a new instance of InjectionManager
     * @returns {InjectionManager}
     */
    constructor() {
      this._registrar = {};
    }

    /**
     * Get the asset by id/name.
     * @param {String} id - An asset name
     * @returns {SVGElement} - A reference to an SVG Element if stored in the registrar.
     */
    get(id) {
      return this._registrar[id];
    }

    /**
     * Begins an potential replacement process.
     * @param {SVGUseElement} useNode - The element that triggered the injection to occur.
     * @returns {Promise} - Resolves to the affected SVG asset, if a replacement has occurred.
     */
    replace(useNode) {
      const { url, exposure, id } = this._parseNode(useNode);
      const node = this.get(id);
      if (node) {
        return Promise.resolve(this._replace(useNode, id));
      }

      if (exposure === 'internal') {
        const root = useNode.getRootNode();
        const rootReference = root.getElementById(id);
        if (rootReference) {
          return Promise.resolve(
            'Reference found in root, replacement halted.'
          );
        }
        return this._embedInternal(useNode, { id });
      }

      if (exposure === 'external') {
        return this._embedExternal(useNode, { id, url });
      }

      return Promise.reject(
        'Could not find asset reference. Ensure the reference sheet or external url exist before executing this script'
      );
    }

    /**
     * Completes the replacement on a referenced <use> node
     * @param {SVGUseElement} useNode - The element that triggered the injection to occur.
     * @param {String} id - The asset id/name to clone and use as replacement model.
     * @returns {SVGElement} - The affected SVG asset.
     */
    _replace(useNode, id) {
      const clone = this.get(id).cloneNode(true);
      const svg = useNode.parentNode;
      svg.setAttribute('replaced', '');
      svg.removeAttribute('onerror');
      svg.removeAttribute('onanimationstart');
      clone.removeAttribute('id');
      this._assignClone(clone, svg);
      useNode.remove();
      return svg;
    }

    /**
     * Executes an Object.assign for SVGElements.
     * @param {SVGElement} clonedRef - The clone of the referenced SVG.
     * @param {SVGElement} host - The SVG which requires additional attributes and/or children.
     */
    _assignClone(clonedRef, host) {
      [...clonedRef.attributes].forEach(({ name, value }) => {
        !host.hasAttribute(name) && host.setAttribute(name, value);
      });
      [...clonedRef.children].forEach((child) => {
        !host.querySelector(child.tagName) && host.appendChild(child);
      });
    }

    /**
     * 
     * @param {SVGUseElement} useNode - The element that triggered the injection to occur.
     * @param {String} id - The asset id/name to clone and use as replacement model.
     * @param {SVGElement} clonedAsset - The asset as an cloned element from the reference sheet.
     */
    register(useNode, id, clonedAsset) {
      this._registrar[id] = clonedAsset;
      return this._replace(useNode, id);
    }

    /**
     * Begins a process to inject markup for using an internal reference sheet
     * @param {SVGUseElement} useNode - The element that triggered the injection to occur.
     * @param {Object} parsedAttrs - A description of useNode attributes.
     * @param {String} parsedAttrs.id -  The asset id/name to clone and use as replacement model.
     * @returns {Promise} - Resolves to the affected SVG asset, if a replacement has occurred.
     */
    _embedInternal(useNode, { id }) {
      const symbolReference = document.getElementById(id);
      if (symbolReference) {
        const symbol = symbolReference.cloneNode(true);
        return Promise.resolve(
          this.register(useNode, id, this._transformSymbol(symbol))
        );
      }
      return Promise.reject(`Symbol '${id}' not found in document.`);
    }

    /**
     * Begins a process to inject markup for using an external reference sheet
     * @param {SVGUseElement} useNode - The element that triggered the injection to occur.
     * @param {Object} parsedAttrs - A description of useNode attributes.
     * @param {String} parsedAttrs.id -  The asset id/name to clone and use as replacement model.
     * @param {String} parsedAttrs.url - The url to fetch the asset markup from.
     * @returns {Promise} - Resolves to the affected SVG asset, if a replacement has occurred.
     */
    _embedExternal(useNode, { id, url }) {
      return window
        .fetch(url)
        .then((res) => res.text())
        .then((text) => {
          const dom = new DOMParser().parseFromString(text, 'image/svg+xml');
          const symbol = dom.querySelector('symbol');
          if (symbol) {
            return this.register(useNode, id, this._transformSymbol(symbol));
          }
          throw new Error(
            `Malformed external reference, please ensure <symbol/> assets.`
          );
        })
        .catch((err) => console.error(err));
    }

    /**
     * Parses a <use> Element for important attributes.
     * @param {SVGUseElement} useNode - The element that triggered the injection to occur.
     * @returns {Object} - { url, exposure, id }
     */
    _parseNode(useNode) {
      const url = useNode.getAttribute('href');
      if (!url) {
        return {};
      }
      const [filepath, id] = url.split('#');
      let exposure = useNode.getAttribute('exposure');
      if (!exposure) {
        exposure = filepath ? 'external' : 'internal';
      }
      return { url, exposure, id };
    }

    /**
     * Transforms a <symbol> from a reference sheet to an <svg>
     * @param {SVGSymbolElement} symbol - The symbol element found within the reference sheet which corresponds to the referenced asset.
     * @returns {SVGElement} - An <svg> element.
     */
    _transformSymbol(symbol) {
      const ns = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(ns, 'svg');
      toArray(symbol.children).forEach((child) => svg.appendChild(child));
      toArray(symbol.attributes).forEach(({ name, value }) => svg.setAttributeNS(ns, name, value));
      return svg;
    }
  }

  function toArray(list) {
    return list.length ? Array.from(list).filter(Boolean) : [];
  }

  if (typeof window !== 'undefined') {
    window[WINDOW_FN_REFERENCE] = new InjectionManager();
  }
}
