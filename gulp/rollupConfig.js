import path                     from 'path';

import babel                    from 'rollup-plugin-babel';
import commonjs                 from 'rollup-plugin-commonjs';
import resolve                  from 'rollup-plugin-node-resolve';
import replace                  from 'rollup-plugin-replace';

import config                   from './config';

const PRODUCTION = config.env === 'production';

function banner(title) {
  return '/*!' +
    '\n * ' + title +
    '\n * @author krikienoid / https://github.com/krikienoid' +
    '\n */\n';
}

function glsl() {
  /*
   * Allow .glsl files in Rollup imports
   * https://github.com/mrdoob/three.js/blob/dev/rollup.config.js
   */
  return {
    transform: function transform(code, id) {
      if (/\.glsl$/.test(id) === false) { return; }

      var transformedCode = 'export default ' + JSON.stringify(
        code
          .replace(/[ \t]*\/\/.*\n/g, '') // remove //
          .replace(/[ \t]*\/\*[\s\S]*?\*\//g, '') // remove /* */
          .replace(/\n{2,}/g, '\n') // # \n+ to \n
      ) + ';';

      return {
        code: transformedCode,
        map: { mappings: '' }
      };
    }
  };
}

export default {
  input: path.join(config.paths.src.js, '/index.js'),
  file: path.join(config.paths.dest.js, '/app.js'),
  format: 'iife',
  indent: '    ',
  sourcemap: !PRODUCTION,
  banner: banner('FlagWaver - App'),
  external: [
    'three'
  ],
  globals: {
    'three': 'THREE'
  },
  plugins: [
    resolve(),
    commonjs({
      include: 'node_modules/**',
      namedExports: {
        'node_modules/react/index.js': [
          'Children', 'createRef', 'Component', 'PureComponent',
          'createContext', 'forwardRef', 'Fragment', 'StrictMode',
          'createElement', 'cloneElement', 'createFactory', 'isValidElement'
        ],
        'node_modules/react-dom/index.js': [
          'createPortal', 'findDOMNode', 'hydrate', 'render'
        ]
      }
    }),
    glsl(),
    babel({
      /*
       * Do not use config settings defined in .babelrc as it is targeted
       * for use with Gulp scripts. Config settings targeted for use with
       * Rollup should be kept separate.
       */
      babelrc: false,
      presets: [
        ['@babel/preset-env', {
          modules: false,
          targets: {
            browsers: config.compatibility
          },
          useBuiltIns: 'entry'
        }],
        '@babel/preset-react'
      ],
      exclude: 'node_modules/**',
      plugins: [
        '@babel/plugin-external-helpers',
        ['@babel/plugin-proposal-class-properties', { 'loose': true }],
      ]
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(config.env),
      'process.env.PUBLIC_URL': JSON.stringify(config.app.PUBLIC_URL)
    })
  ]
};
