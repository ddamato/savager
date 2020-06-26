/**
 * Creates symbols from SVGs either by path or by provided object
 * @param {String|Object} pathOrObject - A path to assets or an object of assetName:assetSvgMarkup
 * @returns {Object} - An object of assetName:assetSymbolMarkup
 */

export default async function createSymbols(pathOrObject) {

  if (typeof pathOrObject === 'string') {
    if (typeof window !== 'undefined' || !require) {
      throw new Error('Can only create symbols using path within node environment.');
    }

    const path = require('path');
    const fs = require('fs');

    try {
      const files = await fs.promises.readdir(pathOrObject);
      const sources = await Promise.all(files.map(async (file) => {
        const filepath = path.resolve(pathOrObject, file);
        const { name, ext } = path.parse(file);
        if (!ext || ext !== '.svg') {
          return;
        }
        const source = await fs.promises.readFile(filepath);
        return { [name]: source.toString() };
      }))
      const flattened = sources.filter(Boolean).reduce(( acc, source ) => Object.assign(acc, source), {});
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