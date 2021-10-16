import path                     from 'path';

import { babel }                from '@rollup/plugin-babel';

import config                   from './config';

export default {
  input: path.join(config.paths.src.js, '/loader.js'),
  output: {
    format: 'iife'
  },
  plugins: [
    babel({
      babelHelpers: 'bundled'
    })
  ]
};
