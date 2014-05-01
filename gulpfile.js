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
  , packager    = require('./lib/packager')({debug: false})
  , $           = require('gulp-load-plugins')({ camelize: true, lazy: false })
  , source      = require('vinyl-source-stream')
  , async       = require('async')
  , chalk       = require('chalk')
  , lr          = require('tiny-lr')();


/*
 Properties ------------------------------------------------
 */


var PROD  = ($.util.env.type === 'production')
  , DEV   = (PROD === false)
  , cfg   = require('./build.config.js');


/*
 Task runners ----------------------------------------------
 */


gulp.task('default', function () {
  var tasks = [ images,  styles, vendor, scripts, index, watch, startExpress, startLiveReload, open ];
  async.eachSeries(tasks, invoke);
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


function styles(cb) {
  clean('style*.css', function() {
    $.util.log('Rebuilding application styles ---');

    gulp.src(cfg.files.styles.all)
      .pipe($.plumber())
      .pipe($.sass(cfg.files.styles.opts))

      .pipe($.if(DEV, $.streamify($.rev())))
      .pipe($.if(PROD, $.csso()))
      .pipe($.if(PROD, $.rename({ext: '.min.css'})))  

      .pipe($.size({ showFiles: true }))
      .pipe(gulp.dest(cfg.destDir))

      .on('end', cb || callback)
      .on('error', $.util.log);
  });
}


function vendor(cb) {
  var bundler = watchify(cfg.files.js.noop)
    .transform('deamdify')
    
    .on('update', rebundle)
    .on('error', $.util.log);

  function rebundle() {
    clean('vendor*.js', function() {
      $.util.log('Rebuilding vendor JS bundle ---');

      packager.require(bundler);
      bundler.bundle({ debug: true })
        .pipe(source(cfg.files.js.vendor.name))

        .pipe($.if(DEV, $.streamify($.rev())))
        // .pipe($.streamify($.ngmin()))
        // .pipe($.streamify($.uglify({ mangle: false })))
        .pipe($.streamify($.size({ showFiles: true })))
        .pipe($.rename({ext: '.min.js'}))  
        .pipe(gulp.dest(cfg.destDir))

        .on('end', cb || callback)
        .on('error', $.util.log);
    });
  }
  rebundle();
}


function scripts(cb) {
  var bundler = watchify(cfg.files.js.app.source)
    .transform('partialify')
    .transform('deamdify')

    .on('update', rebundle)
    .on('error', $.util.log);

  function rebundle() {
    clean('app*.js', function() {
      $.util.log('Rebuilding application JS bundle ---');

      packager.external(bundler);
      bundler.bundle({ debug: true })
        .pipe(source(cfg.files.js.app.name))

        .pipe($.if(DEV, $.streamify($.rev())))
        // .pipe($.if(PROD, $.streamify($.ngmin())))
        // .pipe($.if(PROD, $.streamify($.uglify({ mangle: false }))))
        .pipe($.streamify($.size({ showFiles: true })))
        .pipe($.rename({ext: '.min.js'}))  
        .pipe(gulp.dest(cfg.destDir))

        .on('end', cb || callback)
        .on('error', $.util.log);
    });
  }
  rebundle();
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

    .pipe(inject(cfg.files.styles.app.output, cfg.files.styles.app.tag))
    .pipe(inject(cfg.files.js.app.output, cfg.files.js.app.tag))
    .pipe(inject(cfg.files.js.vendor.output, cfg.files.js.vendor.tag))

    .pipe(gulp.dest(cfg.destDir))
    .on('end', cb || callback)
    .on('error', $.util.log); 
}


function watch(cb) {
  // var server = $.livereload();
  // output
  // gulp.watch(cfg.destDir, function(file) {
  //   $.util.log(chalk.cyan('File changed: '+JSON.stringify(file, null, 4)));
  //   invoke(index, function(){
  //     server.changed(file.path);
  //   })
  // })
  // gulp.watch(cfg.files.js.vendor.output, [index, notifyLivereload]);
  // gulp.watch(cfg.files.js.app.output, [index, notifyLivereload]);

  // gulp.watch(cfg.files.styles.all).on('change', styles)
  // gulp.watch(cfg.files.images.all, images);
  // gulp.watch(cfg.files.fonts.all, fonts);


  // gulp.watch(cfg.files.styles.all, styles);

  // gulp.watch(cfg.files.styles.all).on('change', function() {
  //   styles();
  // })


  gulp.watch(cfg.files.styles.all, function(event) {

    invoke(styles, function(){
      invoke(index, function(){
        notifyLivereload(event);
      })
    })
  });


  // gulp.watch(cfg.files.output, function(event) {

  //   // invoke(styles, function(){
  //     invoke(index, function(){
  //       notifyLivereload(event);
  //     })
  //   // })
  // });


  // gulp.watch(cfg.destDir).on('change', function(file) {
  //   $.util.log(chalk.cyan('File changed: '+JSON.stringify(file, null, 4)));
  //   server.changed(file.path);
  // })

  // gulp.watch(cfg.files.output, notifyLivereload);

  cb();
}


 /*
 Server -----------------------------------
 */


// gulp.task('connect', function (cb) {
function connecter(cb) {
  return connect.server({
    root: './public',
    port: 3000,
    livereload: {port: 35729},
    open: {
      file: 'index.html'
    }
  });
  cb();
}




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


function notifyLivereload(event) {
  gulp.src(event.path, {read: false})
      .pipe(require('gulp-livereload')(lr));
}


function open(cb){
    gulp.src(cfg.files.html.output)
        .pipe($.open("<%file.path%>",{url: cfg.server.url}));
    cb();
}


function invoke(func, cb) {
  var name = func.name.charAt(0).toUpperCase() + func.name.slice(1);
  $.util.log('Invoke: ' + chalk.red(name + ' -------------------'));

  func.apply(this, [cb || callback]);
}


function callback() {
  $.util.log(chalk.green('callback'));
}
