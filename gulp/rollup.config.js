import path                     from 'path';

import alias                    from '@rollup/plugin-alias';
import { babel }                from '@rollup/plugin-babel';
import commonjs                 from '@rollup/plugin-commonjs';
import { nodeResolve }          from '@rollup/plugin-node-resolve';
import replace                  from '@rollup/plugin-replace';
import { threeMinifier }        from '@yushijinhun/three-minifier-rollup';

import packageJson              from '../package.json';
import config                   from './config';

const PRODUCTION = config.env === 'production';
const ROLLUP_QUICK_BUILD = !PRODUCTION;

// Some older versions of Safari do not support the 'nomodule' property on
// the script element, so it is possible for both the ES6 and ES5 versions
// of the main script to be loaded. This guard prevents the main script from
// being executed more than once.
const guardJS = `
    if (window.FLAGWAVER_APP_LOADED) {
        throw new Error('Warning: app.js has already been executed.');
    }

    window.FLAGWAVER_APP_LOADED = true;
`;

function headerComment(title) {
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

      const transformedCode = `export default ${JSON.stringify(
        code
          .replace(/[ \t]*\/\/.*\n/g, '') // remove //
          .replace(/[ \t]*\/\*[\s\S]*?\*\//g, '') // remove /* */
          .replace(/\n{2,}/g, '\n') // # \n+ to \n
      )};`;

      return {
        code: transformedCode,
        map: { mappings: '' }
      };
    }
  };
}

export default [
  {
    input: path.join(config.paths.src.js, '/index.js'),
    output: {
      file: path.join(config.paths.dest.js, '/app.js'),
      format: 'iife',
      indent: ROLLUP_QUICK_BUILD ? false : '    ',
      banner: headerComment('FlagWaver - App'),
      intro: guardJS,
      globals: {
        'modernizr': 'window.Modernizr || {}'
      }
    },
    external: [
      'modernizr'
    ],
    treeshake: !ROLLUP_QUICK_BUILD,
    plugins: [
      threeMinifier(), // <=== Add plugin on the FIRST line
      alias({
        entries: [
          { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' },
          { find: 'react', replacement: 'preact/compat' },
          { find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
          { find: 'react-dom', replacement: 'preact/compat' }
        ]
      }),
      nodeResolve(),
      commonjs({
        include: 'node_modules/**',
        sourcemap: !ROLLUP_QUICK_BUILD
      }),
      glsl(),
      babel({
        babelHelpers: 'runtime',
        targets: 'defaults, > 0.2% and supports es6-module'
      }),
      replace({
        preventAssignment: true,
        values: {
          'process.env.VERSION': JSON.stringify(packageJson.version),
          'process.env.NODE_ENV': JSON.stringify(config.env),
          'process.env.PUBLIC_URL': JSON.stringify(config.app.PUBLIC_URL),
          'process.env.ROOT_URL': JSON.stringify(config.app.ROOT_URL)
        }
      })
    ]
  },
  {
    input: path.join(config.paths.src.js, '/index.js'),
    output: {
      file: path.join(config.paths.dest.js, '/app.es5.js'),
      format: 'iife',
      indent: ROLLUP_QUICK_BUILD ? false : '    ',
      banner: headerComment('FlagWaver - App'),
      intro: guardJS,
      globals: {
        'modernizr': 'window.Modernizr || {}'
      }
    },
    external: [
      'modernizr'
    ],
    treeshake: !ROLLUP_QUICK_BUILD,
    plugins: [
      threeMinifier(), // <=== Add plugin on the FIRST line
      alias({
        entries: [
          { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' },
          { find: 'react', replacement: 'preact/compat' },
          { find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
          { find: 'react-dom', replacement: 'preact/compat' }
        ]
      }),
      nodeResolve(),
      commonjs({
        include: 'node_modules/**',
        sourcemap: !ROLLUP_QUICK_BUILD
      }),
      glsl(),
      babel({
        babelHelpers: 'runtime'
      }),
      replace({
        preventAssignment: true,
        values: {
          'process.env.VERSION': JSON.stringify(packageJson.version),
          'process.env.NODE_ENV': JSON.stringify(config.env),
          'process.env.PUBLIC_URL': JSON.stringify(config.app.PUBLIC_URL),
          'process.env.ROOT_URL': JSON.stringify(config.app.ROOT_URL)
        }
      })
    ]
  }
];
