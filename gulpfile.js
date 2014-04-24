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


var gulp = require("gulp");
var browserify = require("gulp-browserify");
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var filesize = require('gulp-filesize');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var open = require('gulp-open');
var sequence = require('gulp-run-sequence');
var bower = require('gulp-bower-files');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var csso = require('gulp-csso');
var gif = require('gulp-if');
var template = require('gulp-template');
var stylish = require('jshint-stylish');
var sass = require('gulp-sass');
var prefixer = require('gulp-autoprefixer');


/*
 Properties ------------------------------------------------
 */


var PROD = (gutil.env.type === 'production');
var bower_comps = [];

var src = {
    css: ['./src/scss/*.css'],
    sass: ['./src/scss/*.scss'],
    js: ['./src/app/**/*.js'],
    assets: ['./src/assets/*'],
    common: ['./src/common/**/*.js'],
    bower: ['bower.json', '.bowerrc'],
    gulp: ['gulpfile.js.json'],
    index: './src/index.html'
}

var publishdir = 'build'
var dist = {
    all: [publishdir + '/**/*'],
    css: publishdir + '/static/',
    sass: publishdir + '/static/',
    assets: publishdir + '/static/',
    js: publishdir + '/static/',
    vendor: publishdir + '/static/',
    index: publishdir + 'index.html'
}


/*
 Task runners ----------------------------------------------
 */


gulp.task('default', ['watch']);

gulp.task('clean', ['env'], function (cb) {
    sequence('clean', cb);
});

gulp.task('build', ['clean'], function(cb) {
    sequence('clean', 'dist-vendor', 'dist-js', 'dist-css', 'dist-assets', 'dist-html', cb);
})


/*
 Build tasks -----------------------------------
 */


/**
 * Print out environment details
 */
gulp.task('env', function(next) {
    var type = gutil.env.type
      , env = type === undefined ? "dev" : type
      , message = gutil.colors.magenta(env);
    gutil.log('Environment: ' + message);
    next();
});


/**
 * Clean the build directory ~
 */
gulp.task('clean', function() {
    return gulp.src([publishdir], {read: false})
        .pipe(plumber(err))
        .pipe(clean())
});


/**
 * Concats all bower component js/css
 *
 * concat *.js to `vendor.js`
 * and *.css to `vendor.css`
 * rename fonts to `fonts/*.*`
 */
gulp.task('dist-vendor', function() {

    var tap = require('gulp-tap')
      , filter = require('gulp-filter')
      , jsFilter = filter('**/*.js')
      , cssFilter = filter('**/*.css')
      , stream = bower();

    bower_comps = [];
    stream.pipe(plumber(err))

        // Javascript
        .pipe(jsFilter)
        .pipe(tap(mapVendors))
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(dist.js))
        .pipe(jsFilter.restore())

        // Styles
        .pipe(cssFilter)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(dist.css))
        .pipe(cssFilter.restore())

        // Fonts
        .pipe(rename(function(path) {
            if (path.dirname.indexOf('fonts')) {
                path.dirname = '/fonts'
            }
        }))
        .pipe(gulp.dest(dist.vendor))

    return stream;
})


/**
 *  Browserify using vinyl-source-stream ~
 */
gulp.task('dist-js', ['lint'], function() {
    var stream = gulp.src('./src/app/app.js', {read:false})

        // Browserify app
        .pipe(plumber(err))
        .pipe(browserify(opts))

        // Listen for prebundle and errors
        .on('prebundle', externalise)
        .on('error', gutil.log)
        .pipe(concat('app.js'))

        // If Prod, rename and uglify
        .pipe(gif(PROD, rename({ext: '.min.js'})))
        .pipe(gif(PROD, uglify({outSourceMap: !PROD})))

        // Output stream
        .pipe(gulp.dest('./build/static'))
        .pipe(filesize());

    return stream;
})


/**
 * Concat all local styles into app.css
 */
gulp.task('dist-css-old', function() {
    var stream = gulp.src(src.css)
        .pipe(plumber(err))
        .pipe(concat('app.css'))
        .pipe(gif(PROD, csso()))
        .pipe(gif(PROD, rename({ext: '.min.css'})))
        .pipe(gulp.dest(dist.css))
        .pipe(filesize())
    return stream;
})


/**
 *
 */
gulp.task('dist-css', function() {
    var opts = {
        outputStyle: 'compressed',
        sourceComments: 'map',
        includePaths : ['./src/scss']
    }

    return gulp.src(src.sass)
        .pipe(plumber(err))
        .pipe(sass(opts))
//        .pipe(prefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gif(PROD, rename({ext: '.min.css'})))
        .pipe(gulp.dest(dist.css))
});


/**
 * Output image assets to the dist directory
 */
gulp.task('dist-assets', function() {
    return gulp.src(src.assets)
        .pipe(plumber(err))
        .pipe(gulp.dest(dist.assets));
})



/**
 * Output image assets to the dist directory
 */
gulp.task('dist-html', function() {
    var opts = {
        extension: (PROD) ? ".min." : ".",
        title: "ABCts Back-Office"
    }
    return gulp.src(src.index)
        .pipe(plumber(err))
        .pipe(template(opts))
        .pipe(gulp.dest(publishdir));
})


/*
 Utility tasks -----------------------------------
 */


/**
 * Watch all application files for changes
 */
gulp.task('watch', ['server'], function() {

    var server = require('gulp-livereload')();
    gulp.watch(dist.all).on('change' , function(file) {
        server.changed(file.path);
    })

    // Watch for changes in bower/gulp
    gulp.watch(['./bower.json', './gulpfile.js'], ['build']);

    // Watch main js/css for changes
    gulp.watch(['./src/scss/*'], 'dist-css');
    gulp.watch(['./src/app/*', './src/common/*'], 'dist-js');

    // Watch asset sources
    gulp.watch(['./src/index.html'], ['dist-html']);
    gulp.watch(['./src/app/**/*.html'], ['dist-js']);
    gulp.watch(['./src/assets/*'], ['build-assets']);
})


/**
 *
 */
gulp.task('server', ['build'], function(next) {

    var connect = require('connect')
      , http = require('http');

    var app = connect()
        .use(connect.favicon())
        .use(connect.static('./build'))
        .use(function(req, res){
            res.end('Hello from Connect!\n');
        })

    http.createServer(app).listen(3000);
    next();
});


/**
 * JSHint the javascript
 */
gulp.task('lint', function() {
    return gulp.src('./src/app/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'))
});


/*
 Private ------------------------------------------------
 */

/**
 * Outputs plumber errors
 * @param err
 */
var err = function (err) {
    gutil.beep();
    gutil.log('Error: ' + gutil.colors.red(err));
};

/**
 *
 * @param file
 * @param t
 */
var mapVendors = function(file, t) {
    gutil.log('Js: ' + gutil.colors.magenta(file.path));
    bower_comps.push(file);
}


/**
 * Map externalised libraries
 * @param bundler
 */
var externalise = function(bundler) {

    startBlock('Externalise');
    gutil.log('Bower Components: ' + gutil.colors.red(bower_comps.length));

    bower_comps.forEach(function (file) {
        bundler.require(file.path, { external:true });
//        bundler.external(file.path);
        gutil.log('Component: ' + gutil.colors.green(file.path));
    });
    endBlock();
    return bundler;
}


/**
 * Converts a full file path, to the file name. minus any extension/min
 * ie. foo/bar/something-whatevs-1.2.3.blah => something-whatevs
 */
var depName = function(path) { return path.split('/').pop().split(/-\d/).shift() }


/**
 * @param block
 */
var startBlock = function(block) {
    gutil.log(gutil.colors.white(block+': ---------------------------'));
}

/**
 * @param block
 */
var endBlock = function() {
    gutil.log(gutil.colors.white('----------------------------------------'));
}