var gulp=require("gulp");
var gutil=require("gulp-util");
var browserify=require("browserify");
var watchify=require("watchify");
var source=require("vinyl-source-stream");
var lr;

var EXPRESS_PORT=4000;
var EXPRESS_ROOT=__dirname;
var LIVERELOAD_PORT=35729;

gulp.task("default", ["build"], function() {});

gulp.task("build", function(callback) {
    var bundler=getBundler(browserify);

    return bundle(bundler);
});

gulp.task("watch", function () {
    var bundler=getBundler(watchify);

    bundler.on('update', function () {
        verboseBundle(bundler, "watch");
    });

    gulp.watch("./build/bundle.js", notifyChange);

    return verboseBundle(bundler, "watch");
});

gulp.task("dev", function() {
    var bundler=getBundler(watchify);

    startExpress();
    gutil.log("[dev]", "express web server started..");
    startLivereload();
    gutil.log("[dev]", "livereload started...");

    bundler.on('update', function () {
        verboseBundle(bundler, "dev");
    });

    gulp.watch("*.html", notifyLivereload);
    gulp.watch("./build/bundle.js", notifyLivereload);

    return verboseBundle(bundler, "dev");
});

function getBundler(bundle) {
    var bundler=bundle("./main.js");
    bundler.transform("debowerify");
    bundler.transform("browserify-shim");
    bundler.require("./bower_components/angular/angular.js", {expose:"angular"});

    return bundler;
}

function bundle(bundler, cb) {
    return bundler.bundle({debug:true}, cb)
        .pipe(source("bundle.js"))
        .pipe(gulp.dest("./build"));
}

function log(entry) {
    gutil.log("["+new Date().toTimeString()+"]", entry);
}

function verboseBundle(bundler) {
    return bundle(bundler, function (err, src) {
        var timeString;
        if(err) {
            log(err);
        }
    });
}

function startExpress() {
    var express = require('express');
    var app = express();
    app.use(require('connect-livereload')());
    app.use(express.static(EXPRESS_ROOT));
    app.listen(EXPRESS_PORT);
}

function startLivereload() {
    lr=require("tiny-lr")();
    lr.listen(LIVERELOAD_PORT);
}

function notifyChange(event, postHook) {
    var fileName=require('path').relative(EXPRESS_ROOT, event.path);

    log(fileName + " changed");

    if(postHook){
        postHook(fileName);
    }
}

function notifyLivereload(event) {
    notifyChange(event, function (fileName) {
        lr.changed({
            body: {
                files: [fileName]
            }
        });
    });
}