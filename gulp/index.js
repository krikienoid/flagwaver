'use strict';

import path                     from 'path';

import gulp                     from 'gulp';

import browser                  from 'browser-sync';
import rimraf                   from 'rimraf';
import yargs                    from 'yargs';

import file                     from 'gulp-file';
import gulpif                   from 'gulp-if';
import sourcemaps               from 'gulp-sourcemaps';

import autoprefixer             from 'gulp-autoprefixer';
import cleanCss                 from 'gulp-clean-css';
import sass                     from 'gulp-sass';
import sassTildeImporter        from 'node-sass-tilde-importer';

import uglify                   from 'gulp-uglify';
import modernizr                from 'modernizr';
import { rollup }               from 'rollup';
import rollupStream             from 'rollup-stream';
import buffer                   from 'vinyl-buffer';
import source                   from 'vinyl-source-stream';

import config                   from './config';
import rollupConfig             from './rollupConfig';

//
// Config
//

// Check for --production flag
const PRODUCTION = !!yargs.argv.production;

// Set node environment flag
process.env.NODE_ENV = PRODUCTION ? 'production' : 'development';

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
  const filename = path.basename(rollupConfig.file);
  const base = config.paths.src.js;

  return rollupStream(Object.assign({ rollup: { rollup } }, rollupConfig))
    .pipe(source(filename, base))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
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
// Build Images
//

function buildImages() {
  return gulp.src(config.paths.src.img)
    .pipe(gulp.dest(config.paths.dest.img));
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
      buildImages
    )
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
