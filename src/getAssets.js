import urljoin from 'url-join';
import toSvgElementFn from './toSvgElement.js';
import { injectionStyle, injectionAttrs } from './injectionAssets.js';
import injectionInit from './injectionManager.js';

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
      useAttrs.href = urljoin(externalPath, `${assetName}.svg`, useAttrs.href);
    }

    let style = ''
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

export default getAssets;