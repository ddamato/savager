import pkg from './package.json';
import { terser } from 'rollup-plugin-terser';

export default {
  input: './index.js',
  plugins: [terser()],
  output: [{
    file: pkg.main,
    exports: 'named',
    format: 'umd',
    name: 'Savager',
  }, {
    file: pkg.module,
    format: 'esm',
  }]
};
