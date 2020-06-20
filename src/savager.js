import getAssets from './getAssets.js';
import consolidateSheet from './consolidateSheet.js';
import toSvgElementFn from './toSvgElement.js';

/**
 * Configuration options
 * @typedef {Object} ConfigurationOptions - A configuration object.
 * @property {Boolean} attemptInject - Determines if the assets may need to have shape data injected in place.
 * @property {String|Array<String>} classNames - Class names to apply to the assets.
 * @property {String} externalPath - The path to external assets; ie CDN.
 * @property {Boolean|Function} toSvgElement - A function to transform SVG strings into elements, setting as true uses default function.
 * @property {Boolean|String} consolidate - Default is true, attempts to consolidate reference sheets. Setting as a string will use the string as the id for the primary sheet.
 * @property {Boolean} autoAppend - When set, after preparing assets, the reference sheet will automatically append to the document.body in a browser context.
 */

export default class Savager {
  /**
   * Create a new instance of Savager
   * @param {Object} symbols - A map of symbols created using the create-symbols script or function.
   * @param {ConfigurationOptions} options - A configuration object.
   * @returns {Savager} - An instance of Savager
   */
  constructor(symbols, options) {
    this._symbols = {};
    this._options = Object.assign({}, options);
    this.storeSymbols(symbols);
  }

  /**
   * Prepares assets given a set of configurations or using the saved options when the instance was created.
   * @param {String|Object|Array<String|Object>} assetConfigs - A set of options, may be a string or array of strings for basic functionality. Providing an object will allow for more custom settings for a11y purposes.
   * @param {ConfigurationOptions} options - A configuration object.
   * @returns {Object} - { assets, sheet, inject }
   */
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
      const sheet = completeAssetSheet(assetSheet, assetSheetOptions);
      resources.sheet =  renderFn(sheet);
      if (autoAppend) {
        appendSheet(sheet);
      }
    }

    return resources;
  }

  /**
   * Stores the symbols for reference in the instance.
   * @param {Object} symbols - A map of symbols created using the create-symbols script or function.
   * @returns {Savager} - The instance of Savager
   */
  storeSymbols(symbols) {
    this._symbols = Object.assign({}, this._symbols, symbols);
    return this;
  }
}

/**
 * Finalizes the reference sheet
 * @param {String} symbols - A concatenated string of symbol markup.
 * @param {Object} options - A configuration object.
 * @returns {String} - The completed SVG reference sheet.
 */
function completeAssetSheet(symbols, options) {
  const { prepareConsolidation, primarySheetId } = options;
  const id = `savager-${Math.random().toString(36).substr(2, 9)}`;
  const attrs = `id="${id}" xmlns="http://www.w3.org/2000/svg" style="display:none;"`;
  let script = '';
  if (prepareConsolidation) {
    const iife = `(${consolidateSheet.toString()})('${id}', '${primarySheetId}')`.replace(/\"/g, `'`);
    script = `<image href="#" onerror="${iife}"/>`;
  }
  return `<svg ${attrs}>${script}${symbols}</svg>`;
}

/**
 * Attempts to append the reference sheet to the document.body in a browser context.
 * @param {String} sheet - A completed SVG reference sheet
 */
function appendSheet(sheet) {
  if (typeof document !== 'undefined' && document.createElement) {
    document.body.appendChild(toSvgElementFn(sheet));
  } else {
    throw new Error('Attempted to autoAppend without browser context');
  }
}