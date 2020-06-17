const path = require('path');
const fs = require('fs-extra');
const { rollup } = require('rollup');
const { terser } = require('rollup-plugin-terser');

async function bundleInjection() {
  const bundle = await rollup({
    input: path.resolve(__dirname, '..', 'src', 'injectionManager.js'),
    plugins: [terser()],
  });

  const { output } = await bundle.generate({
    format: 'iife',
    name: 'InjectionManager',
  });

  const code = output.reduce((str, chunk) => str + chunk.code, '');
  const iife = `(${code.replace('var InjectionManager=', '')})()`.replace('\n', '').replace('();)()', '())();');

  const iifeOutputFile = path.resolve(__dirname, '..', 'dist', 'injectionManager.iife.js');
  await fs.ensureFile(iifeOutputFile);
  await fs.writeFile(iifeOutputFile, iife, 'utf8');
}

bundleInjection();