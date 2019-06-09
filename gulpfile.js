const { series, parallel, src, dest, watch } = require('gulp')
const postcss = require('gulp-postcss')
const cssnested = require('postcss-nested')
const mixins = require('postcss-mixins')
const postcssPresetEnv = require('postcss-preset-env')
const atImport = require("postcss-import")
const lost = require('lost')
const csswring = require('csswring')
const rucksack = require('rucksack-css');
const mqpacker = require('css-mqpacker')
const browsersync = require('browser-sync').create()

//server stactic
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: './dist'
    },
    port: 3000
  })
  done()
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Tarea para procesar el css
function css() {
  var processors = [
    atImport(),
    mixins(),
    cssnested,
    lost(),
    rucksack(),
    postcssPresetEnv({ overrideBrowserslist: 'last 5 versions'}),
    mqpacker(),
    csswring()
  ]
  return src('src/invie.css')
    .pipe(postcss(processors))
    .pipe(dest('dist/css'))
    .pipe(browsersync.stream())
}

//Vigilar cambios
function watchFiles() {
  watch('./src/*.css', css)
  watch('./dist/*.html').on('change', browserSyncReload)
}

//unificar las tareas
const watcher = parallel(watchFiles, browserSync)

//exportar cambios
exports.default = series(css, watcher)
