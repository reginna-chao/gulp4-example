import gulp from 'gulp';
import { deleteAsync } from 'del';
import babel from 'gulp-babel';
import ignore from 'gulp-ignore';
import uglify from 'gulp-uglify';
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass';
import minifyCSS from 'gulp-clean-css';
import imagemin from 'gulp-imagemin';
import pug from 'gulp-pug';
import browserSync from 'browser-sync';

const sass = gulpSass(dartSass);
const bs = browserSync.create();

// Function to clean the 'dist' directory
function cleanDist() {
  return deleteAsync(['dist']);
}

// JS task
function jsTask() {
  return gulp.src('src/js/*.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(bs.stream());
}

// Sass task
function sassTask() {
  return gulp.src('src/sass/*.scss')
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(gulp.dest('dist/css'))
    .pipe(bs.stream());
}

// Image task
function imageTask() {
  return gulp.src('src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
    .pipe(bs.stream());
}

// Pug task
function pugTask() {
  return gulp.src('src/**/*.pug')
    .pipe(pug())
    .pipe(ignore.exclude('layout/**'))
    .pipe(gulp.dest('dist'))
    .pipe(bs.stream());
}

// BrowserSync task
function browserSyncTask() {
  bs.init({
    server: {
      baseDir: './dist',
    },
  });

  gulp.watch('dist/**/*').on('change', bs.reload);
}

// Main task
const mainTask = gulp.series(cleanDist, gulp.parallel(jsTask, sassTask, imageTask, pugTask), browserSyncTask);

// Build task (no browserSyncTask)
const buildTask = gulp.series(cleanDist, gulp.parallel(jsTask, sassTask, imageTask, pugTask));

// Export tasks
export const build = buildTask;
export default mainTask;