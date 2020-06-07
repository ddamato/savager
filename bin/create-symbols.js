#!/usr/bin/env node
const path = require('path');
const fs = require('fs-extra');
const minimist = require('minimist');
const { createSymbols } = require('../dist/savager.umd.js');

const args = minimist(process.argv.slice(2), {
  string: ['input', 'output', 'name', 'ext'],
  alias: { i: 'input', o: 'output', n: 'name', e: 'ext' },
  default: { name: 'symbols', ext: 'json' },
});

createSymbols(args.input).then((symbols) => {
  fs.ensureDir(args.output).then(() => {
    const contents = args.ext === 'json' ? JSON.stringify(symbols) : symbols;
    fs.writeFile(path.join(args.output, `${args.name}.${args.ext}`), contents, 'utf-8');
  }).catch(() => process.exit(1));
});

