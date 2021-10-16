import path                     from 'path';

import commonjs                 from '@rollup/plugin-commonjs';
import { nodeResolve }          from '@rollup/plugin-node-resolve';

import config                   from './config';

export default {
  input: path.join(config.paths.src.js, '/polyfills.js'),
  output: {
    file: path.join(config.paths.dest.js, '/polyfills.js'),
    format: 'iife'
  },
  plugins: [
    nodeResolve(),
    commonjs({
      include: 'node_modules/**'
    })
  ]
};
