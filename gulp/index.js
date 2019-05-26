'use strict';

import path                     from 'path';

import gulp                     from 'gulp';

import browser                  from 'browser-sync';
import rimraf                   from 'rimraf';

import file                     from 'gulp-file';
import flatten                  from 'gulp-flatten';
import gulpif                   from 'gulp-if';
import replace                  from 'gulp-replace';
import sourcemaps               from 'gulp-sourcemaps';

import autoprefixer             from 'gulp-autoprefixer';
import cleanCss                 from 'gulp-clean-css';
import sass                     from 'gulp-sass';
import sassTildeImporter        from 'node-sass-tilde-importer';

import rollup                   from 'gulp-better-rollup';
import uglify                   from 'gulp-uglify';
import modernizr                from 'modernizr';

import workboxBuild             from 'workbox-build';

import config                   from './config';
import rollupConfig             from './rollupConfig';

const PRODUCTION = config.env === 'production';

//
// Prepare destination directory
//

function clean(done) {
  rimraf(config.paths.dest.root, done);
}

function copyGitIgnore() {
  /*
   * Adding a .gitignore file to the public directory will ensure
   * that unwanted files are not included during deployment.
   */
  return gulp.src('./.gitignore')
    .pipe(gulp.dest(config.paths.dest.root));
}

//
// Build HTML
//

function buildPages() {
  return gulp.src(config.paths.src.html)
    .pipe(replace('@PUBLIC_URL', config.app.PUBLIC_URL))
    .pipe(gulp.dest(config.paths.dest.html));
}

//
// Build CSS
//

function buildCSS() {
  return gulp.src(config.paths.src.sass)
    .pipe(sourcemaps.init())
    .pipe(sass({ importer: sassTildeImporter })
      .on('error', sass.logError)
    )
    .pipe(autoprefixer(config.settings.autoprefixer))
    .pipe(gulpif(PRODUCTION, cleanCss(config.settings.cleanCss)))
    .pipe(gulpif(!PRODUCTION, sourcemaps.write('.')))
    .pipe(gulp.dest(config.paths.dest.css))
    .pipe(browser.reload({ stream: true }));
}

//
// Build JavaScript
//

function buildAppJS() {
  return gulp.src(rollupConfig.input)
    .pipe(sourcemaps.init())
    .pipe(rollup(rollupConfig, rollupConfig.output))
    .pipe(gulpif(PRODUCTION, uglify()
      .on('error', (e) => { console.log(e); })
    ))
    .pipe(gulpif(!PRODUCTION, sourcemaps.write('.')))
    .pipe(gulp.dest(config.paths.dest.js));
}

function buildModernizrJS(done) {
  modernizr.build(config.settings.modernizr, (code) => {
    file('modernizr-custom.js', code, { src: true })
      .pipe(gulpif(PRODUCTION, uglify()
        .on('error', (e) => { console.log(e); })
      ))
      .pipe(gulp.dest(config.paths.dest.js))
      .on('finish', done);
  });
}

function copyExternalJS() {
  return gulp.src(config.paths.deps.js)
    .pipe(gulp.dest(config.paths.dest.js));
}

const buildJS = gulp.parallel(
  buildAppJS,
  buildModernizrJS,
  copyExternalJS
);

//
// Build images
//

function buildImages() {
  return gulp.src(config.paths.src.img)
    .pipe(gulp.dest(config.paths.dest.img));
}

//
// Build fonts
//

function buildFonts() {
  return gulp.src(config.paths.src.fonts)
    .pipe(flatten())
    .pipe(gulp.dest(config.paths.dest.fonts));
}

//
// Build static assets
//

function buildStatic() {
  return gulp.src(config.paths.src.static)
    .pipe(replace('@PUBLIC_URL', config.app.PUBLIC_URL))
    .pipe(gulp.dest(config.paths.dest.static));
}

//
// Build service worker
//

function buildSW() {
  return workboxBuild.generateSW(config.settings.workboxBuild)
    .then(({ count, size }) => {
      console.log(`Generated "${config.settings.workboxBuild.swDest}", which will precache ${count} files, totaling ${size} bytes.`);
    });
}

//
// Server
//

function server(done) {
  browser.init({
    server: config.server.root,
    port: config.server.port
  });

  done();
}

//
// Watch
//

function watch() {
  gulp.watch(config.paths.src.html)
    .on('all', gulp.series(buildPages, browser.reload));

  gulp.watch(config.paths.src.sass)
    .on('all', gulp.series(buildCSS));

  gulp.watch(path.join(config.paths.src.js, '/**/*.js'))
    .on('all', gulp.series(buildJS, browser.reload));

  gulp.watch(config.paths.src.img)
    .on('all', gulp.series(buildImages, browser.reload));
}

//
// Tasks
//

gulp.task(
  'clean',
  clean
);

gulp.task(
  'build',
  gulp.series(
    'clean',
    gulp.parallel(
      copyGitIgnore,
      buildPages,
      buildCSS,
      buildJS,
      buildImages,
      buildFonts,
      buildStatic
    ),
    buildSW
  )
);

gulp.task(
  'default',
  gulp.series(
    'build',
    server,
    watch
  )
);
