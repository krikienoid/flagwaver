const env = process.env.NODE_ENV || 'development';

const browserslist = [
  'last 2 versions',
  'ie >= 9',
  'ios >= 7'
];

export default {
  env: env,
  app: {
    development: {
      PUBLIC_URL: 'http://localhost:8000'
    },
    production: {
      PUBLIC_URL: 'https://krikienoid.github.io/flagwaver'
    }
  },
  server: {
    root: 'dist',
    port: 8000
  },
  paths: {
    src: {
      root:   'src',
      html:   'src/index.html',
      sass:   'src/assets/scss/**/*.scss',
      js:     'src/assets/js',
      img:    'src/assets/img/**/*',
      static: 'src/static/**/*'
    },
    dest: {
      root:   'dist',
      html:   'dist',
      css:    'dist/assets/css',
      js:     'dist/assets/js',
      img:    'dist/assets/img',
      static: 'dist'
    },
    deps: {
      js: [
        'node_modules/three/three.min.js',
        'node_modules/stats.js/build/stats.min.js'
      ]
    }
  },
  browserslist: browserslist,
  settings: {
    autoprefixer: {
      browsers: browserslist
    },
    cleanCss: {
      compatibility: 'ie9'
    },
    modernizr: {
      // https://github.com/Modernizr/Modernizr/blob/master/lib/config-all.json
      'feature-detects': [
        'canvas',
        'css/flexbox',
        'css/flexboxtweener',
        'svg',
        'svg/asimg',
        'svg/inline',
        'webgl'
      ],
      options: [
        'html5shiv',
        'setClasses'
      ]
    },
    workboxBuild: {
      swDest: 'dist/service-worker.js',
      skipWaiting: true,
      clientsClaim: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com/,
          handler: 'staleWhileRevalidate',
          options: {
            cacheName: 'google-fonts-stylesheets'
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com/,
          handler: 'cacheFirst',
          options: {
            cacheName: 'google-fonts-webfonts',
            cacheableResponse: {
              statuses: [0, 200]
            },
            expiration: {
              maxAgeSeconds: 60 * 60 * 24 * 365
            }
          }
        }
      ],
      ignoreURLParametersMatching: [/./],
      directoryIndex: 'index.html',
      cleanupOutdatedCaches: true,
      globDirectory: 'dist',
      globPatterns: [
        '**/*.{html,css,js}',
        'assets/img/**/*.{gif,png,jpg,svg}'
      ]
    }
  },
  init: function () {
    this.app = this.app[env] || this.app['development'];

    return this;
  }
}.init();
