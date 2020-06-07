export default async function createSymbols(pathOrObject) {

  if (!pathOrObject) {
    return {};
  }

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
  }

  if (typeof pathOrObject === 'object') {
    return Object.entries(pathOrObject).reduce((symbols, [name, svg]) => Object.assign(symbols, { [name]: toSymbol(svg, name) }), {});
  }

}

function toSymbol(svgString, name) {
  const str = svgString.replace(/\r?\n|\r| {2,}/g, '');
  const attrsString = str.replace(/<\/?svg ?([^>]+)?>/i, '$1');
  const namespace = ' xmlns="http://www.w3.org/2000/svg"';
  const asSymbol = str
    .replace(attrsString, '') // Remove all the attributes
    .replace(/(<\/?)svg/gmi, '$1symbol') // Replace 'svg' tag name with 'symbol'
    .replace(namespace, ''); // Remove namespace
  return `<svg${namespace}>${asSymbol}</svg>`; // Remove unnecssary line breaks
}