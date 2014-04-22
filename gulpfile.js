var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var streamify = require('gulp-streamify');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var filesize = require('gulp-filesize');
var gutil = require('gulp-util');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var open = require('gulp-open');
var sequence = require('gulp-run-sequence');
var debug = require('gulp-debug');
var server = require('ecstatic');
var url = require('url');
var path = require('path');
var http = require('http');
var bower = require('gulp-bower-files');
var gulpFilter = require('gulp-filter')
var livereload = require('gulp-livereload');
var BatchStream = require('batch-stream2');
var cssmin = require('gulp-minify-css');
var rename = require('gulp-rename');
var stylus = require('gulp-stylus');
var gif = require('gulp-if');
var tap = require('gulp-tap');


/*
 Properties ------------------------------------------------
 */


var PROD = (gutil.env.type !== 'production');
var PORT = 8000;
var LIVERELOAD_PORT = 35729;

var src = {
    css: ['./src/styles/*.css'],
    js: ['./src/app/**/*.js'],
    assets: ['./src/assets/*'],
    common: ['./src/common/**/*.js'],
    bower: ['bower.json', '.bowerrc']
}

var publishdir = 'build'
var dist = {
    all: [publishdir + '/**/*'],
    css: publishdir + '/static/',
    js: publishdir + '/static/',
    vendor: publishdir + '/static/'
}



/*
 Task runners ----------------------------------------------
 */

gulp.task('default', function() {
    sequence('clean', 'bower', 'build', 'livereload');
})
gulp.task('build', function() {
    sequence('css', 'js', 'assets');
})

gulp.task('css', [ 'buildCss' ]);
gulp.task('js', [ 'buildJs' ]);
gulp.task('assets', [ 'buildAssets' ]);


/*
 Internal task definitions -----------------------------------
 */


/**
 * Clean the build directory ~
 */
gulp.task('clean', function() {
    return gulp.src([publishdir], {read: false})
        .pipe(clean())
        .on('error', gutil.log)
});


/**
 * Concats all bower component js/css
 *
 * concat *.js to `vendor.js`
 * and *.css to `vendor.css`
 * rename fonts to `fonts/*.*`
 */
var bcomps;
gulp.task('bower', function() {

    var jsFilter = gulpFilter('**/*.js'),
        cssFilter = gulpFilter('**/*.css');

    var prod = true;
    var min = (prod) ? ".min." : ".";

    bcomps = []
    return bower()

        // Bowerify vendor js
        .pipe(jsFilter)
        .pipe(tap(function(file, t) {
            bcomps.push(file.path);
            gutil.log('Js: ' + gutil.colors.magenta(file.path));
        }))
        .pipe(concat('vendor'+min+'js'))
        .pipe(gulp.dest(dist.js))

        // Clear filters
        .pipe(jsFilter.restore())

        // Bowerify vendor styles
        .pipe(cssFilter)
        .pipe(tap(function(file, t) {
            gutil.log('Css: ' + gutil.colors.magenta(file.path));
        }))
        .pipe(concat('vendor'+min+'css'))
        .pipe(gulp.dest(dist.css))

        // Clear filters
        .pipe(cssFilter.restore())

        // Bowerify vendor fonts
        .pipe(rename(function(path) {
            if (path.dirname.indexOf('fonts')) {
                path.dirname = '/fonts'
            }
        }))
        .pipe(gulp.dest(dist.vendor))
})


/**
 * Concat all local styles into app.css
 */
gulp.task('buildCss', function() {
    return gulp.src(src.css)
        .pipe(concat('app.css'))
        .pipe(gulp.dest(dist.css))
        .on('error', gutil.log)
})


/**
 *  Browserify using vinyl-source-stream ~
 */
gulp.task('buildJs', function() {

    var bundler = browserify('./src/app/app.js');
//    var uglifier = uglify({outSourceMap: false});
//    var compress = (false) ? uglifier : gutil.noop();

    // Externalise vendor js
//    bundler.require(dist.js+"/vendor.js", { external:true });

//    bcomps.forEach(function (lib) {
//        bundler.require(lib);
//        gutil.log('Externalised: ' + gutil.colors.green(lib));
//    });

    // Add transforms
//    bundler.transform("debowerify");
    bundler.transform("partialify");
    bundler.transform("deamdify");

    // Bundle
    bundler.bundle({debug:true})
        .pipe(source("app.js"))
        .pipe(gulp.dest(dist.js))






    var bundler = browserify('./src/app/app.js');
    var uglifier = uglify({outSourceMap: false});
    var compress = (PROD) ? uglifier : gutil.noop();

    // Add transforms
    bundler.transform("debowerify");
    bundler.transform("partialify");

    // Requires
//    bundler.require("./bower_components/angular/angular.js", {expose:"angular"});

    gutil.log('BComps.length: ' + gutil.colors.white(bcomps.length));
    bcomps.forEach(function (lib) {
        bundler.require(lib);
        gutil.log('Externalised: ' + gutil.colors.green(lib));
    });

    // Bundle
    bundler.bundle({debug:true})
        .pipe(source("app.js"))
        .pipe(streamify(compress))
        .pipe(gulp.dest("./build/static"))
        .on('error', gutil.log)
        .pipe(filesize())
})


/**
 * Output all required assets
 */
gulp.task('buildAssets', function() {

    // Index.html
    gulp.src('./src/index.html', { base: './src'})
        .pipe(gulp.dest(publishdir));

    // Assets
    gulp.src(src.assets, { base: './src/assets' })
        .pipe(gulp.dest(publishdir));
})


/**
 *
 */
gulp.task('lint', function() {
    return gulp.src('./src/app/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .on('error', gutil.log)
});


/**
 * Watch all application files for changes
 */
gulp.task('watch', function() {

    // Watch for changes in this file
    gulp.watch(src.bower, ['bower']);

    // Watch main js/css for changes
    gulp.watch({ glob: src.css, name: 'app.css' }, 'buildCss');
    gulp.watch({ glob: src.js, name: 'app.js' }, 'buildJs');

    // Watch asset sources
    gulp.watch(['./src/index.html'], ['buildAssets']);
    gulp.watch(['./src/app/**/*.html'], ['buildAssets']);
    gulp.watch(['./src/assets/*'], ['buildAssets']);

    // Watch output - livereload
    gulp.watch(dist.all, function (file) {
        var relPath = publishdir+'\\' + path.relative('./'+publishdir, file.path);
        gutil.log('File changed: ' + gutil.colors.magenta(relPath));
        livereload.changed(file.path);
    });
})


/**
 *
 */
gulp.task('livereload', ['bower', 'css', 'js', 'assets', 'watch'], function() {
    var server = livereload()
    var batch = new BatchStream({ timeout: 100 })

    gulp.watch(dist.all).on('change', function change(file) {
        // clear directories
        var urlpath = file.path.replace(__dirname + '/' + publishdir, '')
        // also clear the tailing index.html
        urlpath = urlpath.replace('/index.html', '/')
        batch.write(urlpath)
    })
    batch.on('data', function(files) {
        server.changed(files.join(','))
    })
})


/**
 * Compress output files
 */
gulp.task('compress-css', ['css'], function() {
    return gulp.src(dist.css)
        .pipe(cssmin())
        .pipe(gulp.dest(dist.css))
})
gulp.task('compress-js', ['js'], function() {
    return gulp.src(dist.js)
        .pipe(uglify())
        .pipe(gulp.dest(dist.js))
})
gulp.task('compress', ['compress-css', 'compress-js'])
