import { terser } from 'rollup-plugin-terser';
const DEFAULT_FN_NAME = 'Savager';


export default [{
  input: './src/savager.js',
  plugins: [
    terser(),
  ],
  output: {
    file: `./dist/${DEFAULT_FN_NAME}.iife.js`.toLowerCase(),
    format: 'iife',
    name: DEFAULT_FN_NAME,
  }
}, {
  input: './src/savager.js',
  plugins: [
    terser(),
  ],
  output: {
    file: `./dist/${DEFAULT_FN_NAME}.umd.js`.toLowerCase(),
    format: 'umd',
    name: DEFAULT_FN_NAME,
  }
}]