#!/usr/bin/env node
const path = require('path');
const fs = require('fs-extra');
const minimist = require('minimist');
const { createSymbols } = require('../dist/savager.umd.js');

const args = minimist(process.argv.slice(2), {
  string: ['input', 'output', 'type'],
  alias: { i: 'input', o: 'output', t: 'type' },
  default: { t: 'json' },
});

createSymbols(args.input).then(async (symbols) => {
  console.log(`processing: ${args.input}`);
  if (!symbols || !Object.keys(symbols).length) {
    throw new Error(`No svg files found in input directory "${args.input}"`);
  }

  if (args.input === args.output) {
    throw new Error('Cannot overwrite input directory, please provide another directory for output.');
  }

  try {
    await fs.ensureDir(args.output);
  } catch (err) {
    throw new Error(`Output directory "${args.output}" does not exist.`);
  }

  await writeSymbolSvgFiles(symbols, { outputDir: args.output });
  await writeSymbolReferenceFile(symbols, { outputDir: args.output, type: args.type });
}).catch((err) => { throw new Error(err) });

async function writeSymbolReferenceFile(symbols, { outputDir, type }) {
  const json = JSON.stringify(symbols);
  const ext = type === 'json' ? 'json' : 'js';
  let refString;
  switch(type) {
    case 'esm':
      refString = `export default ${json}`;
      break;
    case 'cjs':
      refString = `module.exports = ${json}`;
      break;
    default:
      refString = json;
  }
  const filename = path.join(outputDir, `manifest.${ext}`);
  await fs.ensureFile(filename);
  return fs.writeFile(filename, refString, 'utf-8');
}

async function writeSymbolSvgFiles(symbols, { outputDir }) {
  return Promise.all(Object.entries(symbols).map(async ([ name, svgString ]) => {
    const filename = path.join(outputDir, `${name}.svg`);
    await fs.ensureFile(filename);
    return fs.writeFile(filename, svgString, 'utf-8');
  }));
}