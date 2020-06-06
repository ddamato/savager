const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

async function createSymbols(pathOrObject) {
  if (!pathOrObject) {
    return {};
  }

  if (typeof pathOrObject === 'string') {
    try {
      const files = await readdir(pathOrObject);
      const sources = Promise.all(files.map(async (file) => {
        const fileName = path.parse(file).name;
        const source = await readFile(file);
        return { [fileName]: source };
      }));
      return createAssets(sources);
    } catch (err) {
      throw new Error(err);
    }
  }

  if (typeof pathOrObject === 'object') {
    return Object.entries(pathOrObject).reduce((symbols, [name, svg]) => Object.assign(symbols, { [name]: toSymbol(svg, name) }), {});
  }

}

function toSymbol(svgString, name) {
  const attrsString = svgString.replace(/<\/?svg ?([^>]+)?>/i, '$1');
  const filteredAttrs = attrsString
    .split(' ')
    .filter((attr) => !attr.startsWith('xmlns'))
    .unshift(`id="${name}"`);
  const asSymbol = svgString
    .replace(attrsString, '') // Remove all the attributes
    .replace(/(<\/?)svg/gmi, '$1symbol') // Replace 'svg' tag name with 'symbol'
    .replace(/<symbol /i, `<symbol ${filteredAttrs.join(' ')}`); // Re-insert filtered attributes
  return `<svg xmlns="http://www.w3.org/2000/svg">${asSymbol}</svg>`;
}

module.exports = createSymbols;