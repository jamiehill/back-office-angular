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


var gulp = require('gulp')
  , util = require('./lib/bower-utils')({debug:true})
  , $    = require('gulp-load-plugins')({ camelize: true, lazy: false });


/*
 Properties ------------------------------------------------
 */


var PROD = ($.util.env.type === 'production')
  , cfg = require('./config.js');


/*
 Task runners ----------------------------------------------
 */


gulp.task('default', function (cb) {
    $.runSequence('env','clean', 'build', 'watch', 'connect', cb);
});


gulp.task('build', function(cb) {
    $.runSequence('clean', 'dist-vendor', ['dist-js', 'dist-css', 'dist-assets', 'dist-html'], cb);
})


/*
 Build tasks -----------------------------------
 */


/**
 * Concats all bower component js/css
 *
 * concat *.js to `vendor.js`
 * and *.css to `vendor.css`
 * rename fonts to `fonts/*.*`
 */
gulp.task('dist-vendor', function() {

    var jsFilter = $.filter('**/*.js')
      , cssFilter = $.filter('**/*.css');
        cfg.bowerComponents = util.getPackagePaths();
        
    return gulp.src(cfg.bowerComponents , {read: false})
        .pipe($.plumber(err))

        // Javascript
        .pipe(jsFilter)
        .pipe($.browserify())
        .on('prebundle', vendorModules)
        .pipe($.concat(cfg.files.js.vendor.name))

        .pipe($.if(PROD, $.rename({ext: '.min.js'})))
        .pipe($.if(PROD, $.uglify()))

        .pipe(gulp.dest(cfg.destDir))
        .pipe(jsFilter.restore())

        // Styles
        .pipe(cssFilter)
        .pipe($.concat(cfg.files.styles.vendor.name))

        .pipe($.if(PROD, $.rename({ext: '.min.css'})))
        .pipe($.if(PROD, $.minifyCss()))

        .pipe(gulp.dest(cfg.destDir))
        .pipe(cssFilter.restore())

        // Fonts
        .pipe($.rename(function(path) {
            if (path.dirname.indexOf('fonts')) {
                path.dirname = '/fonts'
            }
        }))
        .pipe(gulp.dest(cfg.destDir))
})


/**
 *  Browserify using vinyl-source-stream ~
 */
gulp.task('dist-js', function() {
    return gulp.src(cfg.files.js.app.path, {read:false})

        // Browserify app
        .pipe($.plumber(err))
        .pipe($.browserify())

        // Listen for prebundle and errors
        .on('prebundle', appModules)
        .pipe($.concat(cfg.files.js.app.name))

        // If Prod, rename and uglify
        .pipe($.if(PROD, $.rename({ext: '.min.js'})))
        .pipe($.if(PROD, $.uglify()))

        // Output stream
        .pipe(gulp.dest(cfg.destDir))
        .pipe($.connect.reload())
        .pipe($.filesize());
})


/**
 * Concat all local styles into app.css
 */
gulp.task('dist-css-old', function() {
    var stream = gulp.src(cfg.files.styles.all)
        .pipe($.plumber(err))
        .pipe($.concat(cfg.files.styles.app.name))
        .pipe($.if(PROD, $.csso()))
        .pipe($.if(PROD, $.rename({ext: '.min.css'})))
        .pipe(gulp.dest(cfg.destDir))
        .pipe($.connect.reload())
        .pipe($.filesize())
    return stream;
})


/**
 * Compiles
 */
gulp.task('dist-css', function() {
    var opts = {
        outputStyle: 'compressed',
        sourceComments: 'map',
        includePaths : [cfg.scssDir]
    }
    return gulp.src(cfg.files.styles.all)
        .pipe($.plumber(err))
        .pipe($.sass(opts))
        // .pipe($.autoprefixer('last 2 versions', { cascade: true }))
        .pipe($.if(PROD, $.rename({ext: '.min.css'})))
        .pipe(gulp.dest(cfg.destDir))
        .pipe($.connect.reload());
});


/**
 * Output image assets to the dist directory
 */
gulp.task('dist-assets', function() {
    return gulp.src(cfg.files.assets.all)
        .pipe($.plumber(err))
        .pipe(gulp.dest(cfg.destDir))
        .pipe($.connect.reload());
})



/**

 * Output image assets to the dist directory
 */
gulp.task('dist-html', function() {
    var opts = {
        extension: (PROD) ? '.min.' : '.',
        title: cfg.appTitle
    }
    return gulp.src(cfg.files.html.index)
        .pipe($.plumber(err))
        .pipe($.template(opts))
        .pipe(gulp.dest(cfg.destDir))
        .pipe($.connect.reload());
})


/*
 Utility tasks -----------------------------------
 */


 /**
 * Print out environment details
 */
gulp.task('env', function() {
    var type = $.util.env.type
      , env = type === undefined ? 'dev' : type;
    $.util.log('Environment: ' + $.util.colors.magenta(env));
});


/**
 * Clean the build directory ~
 */
gulp.task('clean', function() {
    return gulp.src([cfg.files.output], {read: false})
        .pipe($.plumber(err))
        .pipe($.clean())
});


/**
 * Connect the http server
 */
gulp.task('connect', $.connectMulti().server(cfg.server.opts));

//gulp.task('connect', function(){
//    connect.server();
//});


/**
 * Watch all application files for changes
 */
gulp.task('watch', function() {

    // Watch for changes in bower/gulp
    // gulp.watch([cfg.files.bower, cfg.files.gulp], ['build']);

    // Watch main js/css for changes
    gulp.watch([cfg.files.styles.all], 'dist-css');
    gulp.watch([cfg.files.js.all, cfg.files.html.tpl], 'dist-js');

    // Watch asset sources
    gulp.watch([cfg.files.html.index], ['dist-html']);
    gulp.watch([cfg.files.html.tpl], ['dist-js']);
    gulp.watch([cfg.files.assets.all], ['build-assets']);
})


/**
 * Open the browser
 */
gulp.task("open", function(){
    gulp.src(cfg.files.html.output)
        .pipe($.open("<%file.path%>",{url: cfg.server.url}));
});


/**
 * JSHint the javascript
 */
gulp.task('lint', function() {
    return gulp.src(cfg.files.js.all)
        .pipe($.jshint())
        .pipe($.jshint.reporter($.jshintStylish))
        .pipe($.jshint.reporter('fail'))
});


/*
 Private ------------------------------------------------
 */

/**
 * Outputs plumber errors
 * @param err
 */
var err = function (err) {
    $.util.beep();
    $.util.log('Error: ' + $.util.colors.red(err));
};


/**
 * Require vendor libraries and make them available outside the bundle
 * @param bundler
 */
var vendorModules = function(bundler) {
    cfg.bowerComponents.forEach(function (obj) {
        $.util.log('Browserify::require: ' + $.util.colors.green(obj.path));
        bundler.require(obj.name, {expose:obj.name});
    });
    return bundler;
}


/**
 * The following modules are loaded from the vendor
 bundle and are therefore marked as 'external'
 * @param bundler
 */
var appModules = function (bundler) {
    cfg.bowerComponents.forEach(function (obj) {
        bundler.external(obj);
    });
}