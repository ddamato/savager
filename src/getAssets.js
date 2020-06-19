import urljoin from 'url-join';
import toSvgElementFn from './toSvgElement.js';
import { injectionStyle, injectionAttrs } from './injectionAssets.js';
import injectionInit from './injectionManager.js';

function getAssets(assetConfigs, options) {
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

  const svgAssets = [].concat(assetConfigs).reduce(function collectAssets(assets, assetConfig) {
    const assetName = assetConfig.name || assetConfig;
    const assetAttrs = assetConfig.attributes || {};
    const assetTitle = assetConfig.title || '';
    const assetDesc = assetConfig.desc || '';
    const svgAttrs = Object.assign(assetAttrs, { exposure: 'internal' }, primarySvgAttrs);
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

function toAttributes(obj) {
  return Object.entries(obj).map(([ name, value ]) => `${name}="${value}"`).join(' ');
}

export default getAssets;