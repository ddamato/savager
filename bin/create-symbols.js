#!/usr/bin/env node
const path = require('path');
const fs = require('fs-extra');
const minimist = require('minimist');
const { createSymbols } = require('../dist/savager.umd.js');

const args = minimist(process.argv.slice(2), {
  string: ['input', 'output', 'name', 'type'],
  alias: { i: 'input', o: 'output', n: 'name', t: 'type' },
  default: { name: 'symbols', t: 'json' },
});

createSymbols(args.input).then((symbols) => {
  fs.ensureDir(args.output).then(() => {
    const json = JSON.stringify(symbols);
    const ext = args.type === 'json' ? 'json' : 'js';
    let contents;
    switch(args.type) {
      case 'esm':
        contents = `export default ${json}`;
        break;
      case 'cjs':
        contents = `modules.export = ${json}`;
        break;
      default:
        contents = json;
    };
    fs.writeFile(path.join(args.output, `${args.name}.${ext}`), contents, 'utf-8');
  }).catch(() => process.exit(1));
});

