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
  , livereload  = require('connect-livereload')
  , watchify    = require('watchify')
  , path        = require('path')
  , connect     = require('gulp-connect')
  , packager    = require('./lib/packager')({debug: true})
  , $           = require('gulp-load-plugins')({ camelize: true, lazy: false })
  , source      = require('vinyl-source-stream')
  , async       = require('async')
  , chalk       = require('chalk')
  , lr          = require('tiny-lr')()
  , watcher     = require('gulp-watch')
  , gulpReload  = require('gulp-livereload')
  , neat        = require('node-neat')
  , stylish     = require('jshint-stylish');


/*
 Properties ------------------------------------------------
 */


var PROD   = ($.util.env.type === 'production')
  , DEV    = (PROD === false)
  , cfg    = require('./build.config.js')
  , server = $.livereload();


/*
 Task runners ----------------------------------------------
 */


gulp.task('default', function () {
  chain(images, vendorstyles, styles, vendor, lint, scripts, index, watch, startExpress, startLiveReload, open);
});


/*
 General -----------------------------------
 */


function clean(p, cb) {
  var pp = (p === undefined) ? "/*" : p
    , dest = path.join('./', cfg.destDir, pp);
      $.util.log('Cleaning: ' + chalk.blue(dest));

  gulp.src(dest, {read: false})
    .pipe($.rimraf({ force: true }));

  (cb || callback)();
}


/**
 * JSHint the javascript
 */
function lint(cb) {
    return gulp.src(cfg.files.js.all)
      .pipe($.jshint())
      // .pipe($.jshint.reporter('default'))
      .pipe($.jshint.reporter(stylish))
      // .pipe($.jshint.reporter('fail'))

      .on('end', cb || callback)
      .on('error', $.util.log);
}


function images(cb) {
  clean('img/*', function() {
    $.util.log('Minifying images ---');

    gulp.src(cfg.files.images.all)
      .pipe($.plumber())

      .pipe($.imagemin())
      .pipe($.size({ showFiles: true }))
      .pipe(gulp.dest(cfg.files.images.dest))

      .on('end', cb || callback)
      .on('error', $.util.log);
  });
}


function vendorstyles(cb) {
  clean('vendor*.css', function() {
    $.util.log('Rebuilding vendor styles ---');

    gulp.src(cfg.files.styles.vendor.all)
      .pipe($.plumber())

      .pipe($.concat(cfg.files.styles.vendor.name))
      .pipe($.if(DEV, $.streamify($.rev())))
      // .pipe($.csso())
      // .pipe($.if(PROD, $.rename({ext: '.min.css'})))  

      .pipe($.size({ showFiles: true }))
      .pipe(gulp.dest(cfg.destDir))

      .on('end', cb || callback)
      .on('error', $.util.log);
  });
}


function styles(cb) {
  clean('style*.css', function() {
    $.util.log('Rebuilding application styles ---');

    gulp.src(cfg.files.styles.all)
      .pipe($.plumber())
      .pipe($.sass({
//          includePaths: neat.with(cfg.scssDir),
          includePaths: cfg.scssDir,
          outputStyle: 'expanded',
          sourceComments: 'map'
      }))

      .pipe($.if(DEV, $.streamify($.rev())))
      .pipe($.if(PROD, $.csso()))
      // .pipe($.if(PROD, $.rename({ext: '.min.css'})))  

      .pipe($.size({ showFiles: true }))
      .pipe(gulp.dest(cfg.destDir))

      .on('end', cb || callback)
      .on('error', $.util.log);
  });
}


function vendor(cb) {
  var bundler = watchify(cfg.files.js.noop)
    .transform('deamdify')
    
    .on('update', function(){invoke(rebundleVendor)})
    .on('error', $.util.log);
  
  function rebundleVendor() {
    clean('vendor*.js', function() {
      return bundler.bundle(cfg.browserify)
        .pipe(source(cfg.files.js.vendor.name))

        .pipe($.if(DEV, $.streamify($.rev())))
        // .pipe($.streamify($.ngmin()))
        // .pipe($.streamify($.uglify({ mangle: false })))
        .pipe($.streamify($.size({ showFiles: true })))
        // .pipe($.rename({ext: '.min.js'}))  
        .pipe(gulp.dest(cfg.destDir))

        .on('end', cb || callback)
        .on('error', $.util.log);
    });
  }

  packager.require(bundler);
  rebundleVendor();
}


function scripts(cb) {
    var bundler = watchify(cfg.files.js.app.source)
        .transform('partialify')
        .transform('deamdify')
        
        .on('update', function(){invoke(rebundleScripts)})
        .on('error', $.util.log);

  function rebundleScripts() {
    clean('app*.js', function() {
      return bundler.bundle(cfg.browserify)
        .pipe(source(cfg.files.js.app.name))

        .pipe($.if(DEV, $.streamify($.rev())))
        .pipe($.if(PROD, $.streamify($.ngmin())))
        .pipe($.if(PROD, $.streamify($.uglify({ mangle: false }))))
        .pipe($.streamify($.size({ showFiles: true })))
        .pipe($.rename({ext: '.min.js'}))  
        .pipe(gulp.dest(cfg.destDir))

        .on('end', cb || callback)
        .on('error', $.util.log);
    });
  }

  packager.external(bundler);
  rebundleScripts();
}


function fonts(cb) {
  clean(cfg.files.fonts.icons, function() {
    $.util.log('Copying fonts ---');

    gulp.src(cfg.files.fonts.all)
      .pipe($.plumber())
      .pipe(gulp.dest(cfg.files.fonts.dest))

      .on('end', cb || callback)
      .on('error', $.util.log);
  });
}


function index(cb) {
  function inject(glob, tag) {
    $.util.log('Injecting: ' + chalk.blue(glob + ' - ' + tag));

    return $.inject(gulp.src(glob, {read: false}), {
      starttag: '<!-- inject:'+tag+' -->',
      ignorePath:'/public/',
      addRootSlash: false
    });
  }

  gulp.src(cfg.files.html.source)
    .pipe($.plumber())

    .pipe(inject(cfg.files.styles.vendor.output, cfg.files.styles.vendor.tag))
    .pipe(inject(cfg.files.styles.app.output, cfg.files.styles.app.tag))
    .pipe(inject(cfg.files.js.app.output, cfg.files.js.app.tag))
    .pipe(inject(cfg.files.js.vendor.output, cfg.files.js.vendor.tag))

    .pipe(gulp.dest(cfg.destDir))
    .on('end', cb || callback)
    .on('error', $.util.log); 
}


function watch(cb) {
  gulp.watch(cfg.files.js.output, function(event){
    chainReload([index], event.path);
  });

  gulp.watch(cfg.files.js.vendor.output, function(event){
    chainReload([index], event.path);
  });

  gulp.watch(cfg.files.html.output, function(event){
    // $.util.log(chalk.bgMagenta(' Reload: ' + event.path + " ------- "));
    // server.changed(event.path);
  });

  gulp.watch(cfg.files.styles.all, function(event){
    chainReload([styles, index], event.path);
  });

  gulp.watch(cfg.files.images.all, function(event){
    chainReload([images], event.path);
  });

  cb();
}


 /*
 Server -----------------------------------
 */


function startExpress(cb) {
  var app = express();
  app.use(livereload(cfg.server.opts.livereload));
  app.use(express.static(cfg.destDir));
  app.listen(cfg.server.opts.port, function(){
    $.util.log(chalk.yellow('Express listening on port:', cfg.server.opts.port));
  });
  cb();
}


function startLiveReload(cb) {
  lrServer.listen(cfg.server.opts.livereload.port, function(err) {
    if (err) return $.util.log($.util.colors.red(err));
    $.util.log(chalk.yellow('Livereload heard something!'));
  });
  cb();
}


function open(cb){
      gulp.src(cfg.files.html.output)
          .pipe($.open("<%file.path%>",{url: cfg.server.url}));
      cb();
  }


function chain() {
  var tasks = Array.prototype.slice.call(arguments);
  async.eachSeries(tasks, invoke);
}


function chainReload() {
  var args = Array.prototype.slice.call(arguments)
  async.eachSeries(args[0], invoke, function(){
    $.util.log(chalk.bgMagenta(' Reload: ' + args[1] + " ------- "));
    server.changed(args[1]);
  });
}


function invoke(func, cb) {
  var name = func.name.charAt(0).toUpperCase() + func.name.slice(1);
  $.util.log('Invoke: ' + chalk.red(name + ' -------------------'));

  func.apply(this, [cb || callback]);
}


function callback() {
  $.util.log(chalk.green('callback'));
}
