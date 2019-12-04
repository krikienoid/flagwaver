const env = process.env.NODE_ENV || 'development';

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
      fonts:  'src/assets/fonts/**/*.{eot,svg,ttf,woff,woff2}',
      static: 'src/static/**/*'
    },
    dest: {
      root:   'dist',
      html:   'dist',
      css:    'dist/assets/css',
      js:     'dist/assets/js',
      img:    'dist/assets/img',
      fonts:  'dist/assets/fonts',
      static: 'dist'
    },
    deps: {
      js: [
        'node_modules/three/build/three.min.js'
      ]
    }
  },
  settings: {
    autoprefixer: {
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
        'svg/inline'
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
          urlPattern: /assets\/fonts/,
          handler: 'staleWhileRevalidate',
          options: {
            cacheName: 'webfonts'
          }
        },
        {
          urlPattern: /^https:\/\/ajax\.googleapis\.com/,
          handler: 'staleWhileRevalidate',
          options: {
            cacheName: 'google-typekit-webfontloader'
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
