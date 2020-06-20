import urljoin from 'url-join';
import toSvgElementFn from './toSvgElement.js';
import { injectionStyle, injectionAttrs } from './injectionAssets.js';
import injectionInit from './injectionManager.js';

/**
 * Configuration options
 * @typedef {Object} ConfigurationOptions - A configuration object.
 * @property {Boolean} attemptInject - Determines if the assets may need to have shape data injected in place.
 * @property {String|Array<String>} classNames - Class names to apply to the assets.
 * @property {String} externalPath - The path to external assets; ie CDN.
 * @property {Boolean|Function} toSvgElement - A function to transform SVG strings into elements, setting as true uses default function.
 */

/**
 * Get assets based on provided configurations
 * @param {String|Object|Array<String|Object>} assetConfigs - A set of options, may be a string or array of strings for basic functionality. Providing an object will allow for more custom settings for a11y purposes.
 * @param {ConfigurationOptions} options - A configuration object.
 * @returns {Object} - { assets, inject }
 */
function getAssets(assetConfigs, options) {
  const { 
    externalPath,
    attemptInject,
    classNames,
    toSvgElement,
  } = options || {};
  const primarySvgAttrs = { 
    xmlns: 'http://www.w3.org/2000/svg',
    class: [].concat(classNames).filter(Boolean)
  };

  const resources = {};

  if (attemptInject) {
    resources.inject = injectionInit;
  }

  let renderFn = (svgString) => svgString;
  if (toSvgElement) {
    renderFn = typeof toSvgElement === 'function' ? toSvgElement : toSvgElementFn;
  }

  const svgAssets = [].concat(assetConfigs).reduce(function collectAssets(assets, assetConfig) {
    const assetName = assetConfig.name || assetConfig;
    const assetAttrs = assetConfig.attributes || {};
    const assetTitle = assetConfig.title || '';
    const assetDesc = assetConfig.desc || '';
    const svgAttrs = Object.keys(assetAttrs).reduce((attrs, attr) => {
      attrs[attr] = ['class', 'className'].includes(attr)
        ? attrs[attr].concat(assetAttrs[attr]).filter(Boolean)
        : assetAttrs[attr];
      return attrs;
    }, Object.assign({ exposure: 'internal' }, primarySvgAttrs));
    let useAttrs = { href: `#${assetName}` };

    if (typeof externalPath === 'string') {
      svgAttrs.exposure = 'external';
      useAttrs.href = urljoin(externalPath, `${assetName}.svg`, useAttrs.href);
    }

    let title = '';
    if (assetTitle) {
      title = `<title>${assetTitle}</title>`;
    }

    let desc = '';
    if (assetTitle && assetDesc) {
      desc = `<desc>${assetDesc}</desc>`;
    }

    let style = ''
    if (attemptInject) {
      style = injectionStyle;
      useAttrs = Object.assign(useAttrs, injectionAttrs);
    }

    const svgString = `<svg ${toAttributes(svgAttrs)}>${title}${desc}${style}<use ${toAttributes(useAttrs)}/></svg>`;
    return Object.assign(assets, { [assetName]: svgString });
  }, {});

  resources.assets = Object.entries(svgAssets).reduce(function renderAssets(acc, [name, svgString]) {
    return Object.assign(acc, { [name]: renderFn(svgString) });
  }, {});

  return resources;
}

/**
 * Creates the attribute string for markup.
 * @param {Object} obj - A configuration of attributes; key/value pairs to assign
 * @returns {String} - An attribute string for an SVG element
 */
function toAttributes(obj) {
  return Object.entries(obj).map(([ name, value ]) => {
    if (Array.isArray(value)) value = value.join(' ');
    return `${name}="${value}"`;
  }).join(' ');
}

export default getAssets;