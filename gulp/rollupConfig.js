import path                     from 'path';

import babel                    from 'rollup-plugin-babel';
import commonjs                 from 'rollup-plugin-commonjs';
import resolve                  from 'rollup-plugin-node-resolve';
import replace                  from 'rollup-plugin-replace';

import packageJson              from '../package.json';
import config                   from './config';

const PRODUCTION = config.env === 'production';
const ROLLUP_QUICK_BUILD = !PRODUCTION;

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
  output: {
    file: path.join(config.paths.dest.js, '/app.js'),
    format: 'iife',
    indent: ROLLUP_QUICK_BUILD ? false : '    ',
    banner: banner('FlagWaver - App'),
    globals: {
      'modernizr': 'window.Modernizr || {}',
      'three': 'THREE'
    }
  },
  external: [
    'modernizr',
    'three'
  ],
  treeshake: !ROLLUP_QUICK_BUILD,
  plugins: [
    resolve(),
    commonjs({
      include: 'node_modules/**',
      sourcemap: !ROLLUP_QUICK_BUILD,
      namedExports: {
        'node_modules/react/index.js': [
          'Children', 'createRef', 'Component', 'PureComponent',
          'createContext', 'forwardRef', 'lazy', 'memo',
          'useCallback', 'useContext', 'useEffect', 'useImperativeHandle',
          'useDebugValue', 'useLayoutEffect', 'useMemo', 'useReducer',
          'useRef', 'useState', 'Fragment', 'StrictMode', 'Suspense',
          'createElement', 'cloneElement', 'createFactory', 'isValidElement',
          'version', 'unstable_ConcurrentMode', 'unstable_Profiler'
        ],
        'node_modules/react-dom/index.js': [
          'createPortal', 'findDOMNode', 'hydrate', 'render',
          'unstable_renderSubtreeIntoContainer', 'unmountComponentAtNode',
          'unstable_createPortal', 'unstable_batchedUpdates',
          'unstable_interactiveUpdates', 'flushSync',
          'unstable_createRoot', 'unstable_flushControlled'
        ],
        'node_modules/react-redux/node_modules/react-is/index.js': [
          'typeOf', 'AsyncMode', 'ConcurrentMode',
          'ContextConsumer', 'ContextProvider', 'Element', 'ForwardRef',
          'Fragment', 'Lazy', 'Memo', 'Portal', 'Profiler',
          'StrictMode', 'Suspense',
          'isValidElementType', 'isAsyncMode', 'isConcurrentMode',
          'isContextConsumer', 'isContextProvider', 'isElement', 'isForwardRef',
          'isFragment', 'isLazy', 'isMemo', 'isPortal', 'isProfiler',
          'isStrictMode', 'isSuspense'
        ]
      }
    }),
    glsl(),
    babel(),
    replace({
      'process.env.VERSION': JSON.stringify(packageJson.version),
      'process.env.NODE_ENV': JSON.stringify(config.env),
      'process.env.PUBLIC_URL': JSON.stringify(config.app.PUBLIC_URL)
    })
  ]
};
