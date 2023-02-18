const env = process.env.NODE_ENV || 'development';

export default {
  env: env,
  app: {
    development: {
      PUBLIC_URL: 'http://localhost:8000',
      ROOT_URL: '.'
    },
    production: {
      PUBLIC_URL: 'https://krikienoid.github.io/flagwaver',
      ROOT_URL: '.'
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
    }
  },
  settings: {
    autoprefixer: {
    },
    cleanCss: {
    },
    modernizr: {
      // https://github.com/Modernizr/Modernizr/blob/master/lib/config-all.json
      'feature-detects': [
      ],
      options: [
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
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'webfonts'
          }
        },
        {
          urlPattern: /^https:\/\/ajax\.googleapis\.com/,
          handler: 'StaleWhileRevalidate',
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
