var gulp = require('gulp')
packager = require('./src/common/build/bower/packager')({debug:true})
    , $ = require('./src/common/build/gulp/load-plugins')({ camelize: true, lazy: false });


/*
 Properties ------------------------------------------------
 */


var PROD = ($.util.env.type === 'production')
    , DEV = (PROD === false)
    , cfg = require('./build.config.js')
    , server = $.livereload();


/*
 Task runners ----------------------------------------------
 */


gulp.task('default', function () {
    clean();
    chain(images, styles, vendor2, scripts, index, watch, startExpress);
});


/*
 General -----------------------------------
 */


/**
 * Cleans the specified location and/or file/s
 * @param string path path to folder/files to clean
 * @param function cb async sequencial callback method
 */
function clean(p, cb) {
    var path = (p === undefined) ? "/*" : p,
        files = $.path.join('./', cfg.destDir, path);

    $.util.log('Cleaning: ' + $.chalk.blue(files));
    gulp.src(files, {read: false})
        .pipe($.clean({force: true}))

        .on('end', cb || callback)
        .on('error', $.util.log);
}


/**
 * JSHint the javascript
 * @param function cb async sequencial callback method
 */
function lint(cb) {
    gulp.src(cfg.files.js.all)

        .pipe($.jshint())
        .pipe($.jshint.reporter($.jshintStylish))

        .on('end', cb || callback)
        .on('error', $.util.log);
}


/**
 * Copies and minifies all images
 * @param function cb async sequencial callback method
 */
function images(cb) {
    clean('img/*', function () {
        $.util.log('Minifying images ---');

        gulp.src(cfg.files.images.all)
            .pipe($.imagemin())

            .pipe($.size({ showFiles: true }))
            .pipe(gulp.dest(cfg.files.images.dest))

            .on('end', cb || callback)
            .on('error', $.util.log);
    });
}


/**
 * Compiles all scss/sass styles to app.css
 * @param function cb async sequencial callback method
 */
function styles(cb) {
    clean('style*.css', function () {
        $.util.log('Rebuilding application styles ---');

        gulp.src(cfg.files.styles.all)
            .pipe($.sass({
                includePaths: cfg.scssDir,
                outputStyle: 'expanded',
                sourceComments: 'map'
            }))

            .pipe($.if(PROD, $.rename({extname: '.min.css'})))
            .pipe($.if(PROD, $.csso()))

            .pipe($.autoprefixer('last 2 versions', {map: false }))
            .pipe($.size({ showFiles: true }))
            .pipe(gulp.dest(cfg.destDir))

            .on('end', cb || callback)
            .on('error', $.util.log);
    });
}


/**
 * Walks all bower_components' files to output
 * vendor.js, vendor.css and any associated fonts
 * @param function cb async sequencial callback method
 */
function vendor(cb) {

    var jsfilter = $.filter('**/*.js'),
        cssfilter = $.filter('**/*.css'),
        assetsfilter = $.filter(['!**/*.js', '!**/*.css', '!**/*.scss']);

    clean('vendor*.*', function () {
        $.bowerFiles({ debugging: true })
            .pipe($.plumber())

            // vendor js
            .pipe(jsfilter)
            .pipe($.concat(cfg.files.js.vendor.name))
            .pipe($.uglify({ mangle: false }))
            .pipe($.rename({extname: '.min.js'}))

            .pipe($.size({ showFiles: true }))
            .pipe(gulp.dest(cfg.destDir))
            .pipe(jsfilter.restore())

            // vendor css
            .pipe(cssfilter)
            .pipe($.csso())
            .pipe($.concat(cfg.files.styles.vendor.name))
            .pipe($.size({ showFiles: true }))
            .pipe(gulp.dest(cfg.destDir))
            .pipe(cssfilter.restore())

            // Fonts
            .pipe($.rename(function (path) {
                if (path.dirname.indexOf('fonts')) {
                    path.dirname = '/fonts'
                }
            }))
            .pipe(gulp.dest(cfg.destDir))

            // vendor assets
//      .pipe(assetsfilter)
//      .pipe(gulp.dest(cfg.destDir))
//      .pipe(assetsfilter.restore())

            .on('end', cb || callback)
            .on('error', $.util.log)
    });
}


/**
 * Walks all bower_components' files to output
 * vendor.js, vendor.css and any associated fonts
 * @param function cb async sequencial callback method
 */
function vendor2(cb) {
    clean('vendor*.*', function () {
        var bundle = $.browserify(cfg.files.js.noop)
            .transform('partialify')
            .transform('browserify-shim');

        packager.require(bundle, cfg.bower);
        bundle.bundle({debug: true, standalone:"backoffice"})
            .pipe($.vinylSourceStream(cfg.files.js.vendor.name))

            .pipe($.if(PROD, $.streamify($.uglify({ mangle: false }))))
            .pipe($.if(PROD, $.rename({extname: '.min.js'})))

            .pipe($.streamify($.size({ showFiles: true })))
            .pipe(gulp.dest(cfg.destDir))

            .on('end', cb || callback)
            .on('error', $.util.log);
    });
}


/**
 * [scripts description]
 * @param  {Function} cb [description]
 * @return {[type]}      [description]
 */
function scripts(cb) {
    clean('app*.js', function () {
        var bundle = $.browserify(cfg.files.js.app.source)
            .transform('partialify')
            .transform('browserify-shim');

        packager.external(bundle, cfg.bower);
        bundle.bundle({debug: true, standalone: 'noscope'})
            .pipe($.vinylSourceStream(cfg.files.js.app.name))

            .pipe($.if(PROD, $.streamify($.uglify({ mangle: false }))))
            .pipe($.if(PROD, $.rename({extname: '.min.js'})))

            .pipe($.streamify($.size({ showFiles: true })))
            .pipe(gulp.dest(cfg.destDir))

            .on('end', cb || callback)
            .on('error', $.util.log);
    });
}


/**
 * Concatenates all application js files into app.js
 * @param function cb async sequencial callback method
 */
function scriptsNonBrowserify(cb) {
    clean('vendor*.*', function () {
        gulp.src(cfg.files.js.all)
            .pipe($.concat(cfg.files.js.app.name))

            .pipe($.if(PROD, $.uglify({ mangle: false })))
//      .pipe($.if(PROD, $.rename({extname: '.min.js'})))

            .pipe($.size({ showFiles: true }))
            .pipe(gulp.dest(cfg.destDir))

            .on('end', cb || callback)
            .on('error', $.util.log);
    });
}


/**
 * [templates description]
 * @param function cb async sequencial callback method
 */
function templates(cb) {
    clean('template*.js', function () {
        gulp.src(cfg.files.tpl.all)
            .pipe($.minifyHtml({ quotes: true }))
            .pipe($.angularTemplatecache(cfg.files.tpl.name, cfg.files.tpl.opts))

            .pipe($.size({ showFiles: true }))
            .pipe(gulp.dest(cfg.destDir))

            .on('end', cb || callback)
            .on('error', $.util.log);
    });
}


/**
 * Constructs index.html, injecting pertinant dependecies
 * @param function cb async sequencial callback method
 */
function index(cb) {
    gulp.src(cfg.files.html.source)
        .pipe(inject(cfg.files.styles.vendor.output, cfg.files.styles.vendor.tag))
        .pipe(inject(cfg.files.styles.app.output, cfg.files.styles.app.tag))
        .pipe(inject(cfg.files.js.app.output, cfg.files.js.app.tag))
        .pipe(inject(cfg.files.js.vendor.output, cfg.files.js.vendor.tag))
        .pipe(inject(cfg.files.js.template.output, cfg.files.js.template.tag))
        .pipe(gulp.dest(cfg.destDir))

        .on('end', cb || callback)
        .on('error', $.util.log);
}


/**
 * [watch description]
 * @param function cb async sequencial callback method
 */
function watch(cb) {
    gulp.watch(cfg.files.js.output, function (event) {
        chainReload([index], event.path);
    });

    gulp.watch(cfg.files.js.vendor.output, function (event) {
        chainReload([index], event.path);
    });

    gulp.watch(cfg.files.html.output, function (event) {
        // $.util.log($.chalk.bgMagenta(' Reload: ' + event.path + " ------- "));
        // server.changed(event.path);
    });

    gulp.watch(cfg.files.styles.all, function (event) {
        chainReload([styles, index], event.path);
    });

    gulp.watch(cfg.files.images.all, function (event) {
        chainReload([images], event.path);
    });

    cb();
}


/*
 Server -----------------------------------
 */


function startExpress(cb) {
    var app = $.connect()
        .use($.connectLivereload({ port: 35729 }))
        .use($.connect.static(cfg.destDir))
        .use($.connect.directory(cfg.destDir));

    gulp.server = $.http.createServer(app)
        .listen(9000)
        .on('listening', function () {
            $.util.log($.chalk.yellow('Connect listening on port:', 9000));
        })

    $.opn('http://localhost:9000');
    cb();


    // var app = $.express();
    // app.use($.livereload(cfg.server.opts.livereload));
    // app.use($.express.static(cfg.destDir));
    // app.listen(cfg.server.opts.port, function(){
    //   $.util.log($.chalk.yellow('Express listening on port:', cfg.server.opts.port));
    // });
    // cb();
}


function startLiveReload(cb) {
    // $.tingLr.listen(cfg.server.opts.livereload.port, function(err) {
    //   if (err) return $.util.log($.util.colors.red(err));
    //   $.util.log($.chalk.yellow('Livereload heard something!'));
    // });
    cb();
}

function inject(glob, tag) {
    $.util.log('Injecting: ' + $.chalk.blue(glob + ' - ' + tag));

    return $.inject(gulp.src(glob, {read: false}), {
        starttag: '<!-- inject:' + tag + ' -->',
        ignorePath: '/public/',
        addRootSlash: false
    });
}


function open(cb) {
    gulp.src(cfg.files.html.output)
        .pipe($.open("<%file.path%>", {url: cfg.server.url}));
    cb();
}


function chain() {
    var tasks = Array.prototype.slice.call(arguments);
    $.async.eachSeries(tasks, invoke);
}


function chainReload() {
    var args = Array.prototype.slice.call(arguments)
    $.async.eachSeries(args[0], invoke, function () {
        $.util.log($.chalk.bgMagenta(' Reload: ' + args[1] + " ------- "));
        server.changed(args[1]);
    });
}


function invoke(func, cb) {
    var name = func.name.charAt(0).toUpperCase() + func.name.slice(1);
    $.util.log('Invoke: ' + $.chalk.red(name + ' -------------------'));

    func.apply(this, [cb || callback]);
}


function callback() {
    $.util.log($.chalk.green('callback'));
}
