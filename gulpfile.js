/*

 Gulpfile for building Back-Office application.

 The application will build in two modes:  development or production.  In order
 to specify 'production', the gulp cli property type should be set to 'production':

        gulp --type production

 Any other value, or indeed none specified at all, will be assumed to be 'development'.

 Assumptions specific to the app this was pulled from:

     1. Things there are only one of:

     - Single JS entry point in ./src/app/app.js
     - Single CSS file in ./src/styles/style.css (named whatever)
     - Single HTML file in ./src/index.html (used as template)

     2. Using Bootstrap, with glpyhicon fonts in ./vendor/fonts

 */


var gulp        = require('gulp')
  , express     = require('express')
  , lrServer    = require('tiny-lr')()
  , watchify    = require('watchify')
  , path        = require('path')
  , $           = require('gulp-load-plugins')({ camelize: true, lazy: false })
  , app         = express();


/*
 Properties ------------------------------------------------
 */


var PROD = ($.util.env.type === 'production')
  , cfg = require('./build.config.js');


/*
 Task runners ----------------------------------------------
 */


gulp.task('default', function () {
  startExpress();
  startLiveReload();
  scripts();
});


/*
 General -----------------------------------
 */


function clean(p, cb) {
  $.util.log('Cleaning: ' + $.util.colors.blue(p));

  var dest = path.join(cfg.destDir, p)
    , tmp  = path.join(cfg.tmpDir, p); 

  gulp .src([dest, tmp], {read: false})
    .pipe($.rimraf({ force: true }))
    .on('end', cb || function() {});
}


function scripts(cb) {
  var bundler = watchify(cfg.files.js.app.path);

  function rebundle() {
    clean(cfg.files.js.app.token, function() {
      $.util.log('Rebuilding application JS bundle');

      return bundler.bundle({ debug: true })
        .pipe(source(cfg.files.js.app.name))
        .pipe(gulp.dest(cfg.tmpDir))
        .pipe(plugins.streamify(plugins.uglify({ mangle: false })))
        .pipe(plugins.streamify(plugins.size({ showFiles: true })))
        .pipe(gulp.dest(cfg.destDir))
        .on('end', cb || function() {})
        .on('error', $.util.log);
    });
  }

  bundler.on('update', rebundle);
  bundler.on('error', $.util.log);
  rebundle();
}

 /*
 Server -----------------------------------
 */


function startExpress() {
  app.use(require('connect-livereload'));
  app.use(express.static(cfg.server.express.root));
  app.listen(cfg.server.express.port);
}


function startLiveReload() {
  lrServer.listen(cfg.server.express.liveReloadPort, function(err) {
    if (err) return console.log(err);
  });
}


function notifyLivereload(fileName) {
  if (fileName !== cfg.html.name || permitIndexReload) {
    lrServer.changed({ body: { files: [fileName] } });

    if (fileName === cfg.html.name) {
      permitIndexReload = false;
      setTimeout(function() { permitIndexReload = true; }, cfg.server.express.timeout);
    }
  }
}
