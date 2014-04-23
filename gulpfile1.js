var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var livereload = require('gulp-livereload');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var open = require("gulp-open");
var http = require('http');
var connect = require('connect');
var gutil=require("gulp-util");
var clean=require("gulp-clean");
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');


gulp.task("default", ["browserify"], function() {});

gulp.task("build", [ "clean", "browserify", "copy", "watch", "serve", "open"]);


gulp.task('browserify', function() {
    browserify()
        .bundle({debug:true})
        .pipe(source("app.js"))
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest("./public"))
        .pipe(livereload());
});


gulp.task('scripts', function() {
    return gulp.src('src/app/app.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(browserify({
            shim: browserifyShim,
            insertGlobals : true,
            debug : !gutil.env.production
        }))
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(livereload(server))
        .pipe(notify({ message: 'Scripts task complete' }));
});


gulp.task('clean', function(){
    return gulp.src(['./public/*'], {read:false})
        .pipe(clean());
});


gulp.task('copy',['clean'], function(){

    gulp.src(paths.html, {cwd: bases.app})
        .pipe(gulp.dest(bases.dist));

    var filesToCopy = [
        './src/index.html',
        './src/assets/**/*.*'
    ];

    gulp.src(filesToCopy, { base: './src' })
        .pipe(gulp.dest('./public'));
});


gulp.task("open", function(){
    gulp.src("./public/index.html")
        .pipe(open("<%file.path%>"));
})


gulp.task("serve", function(){
    var app = connect()
        .use(connect.logger('dev'))
        .use(connect.static("./"));

    http.createServer(app).listen(8080);
})


gulp.task('images', function(){
    var dist = "./public/img";
    gulp.src("./src/assets/img/**")
        .pipe(changed(dist))
        .pipe(imagemin())
        .pipe(gulp.dest(dist))
        .pipe(livereload())
})


gulp.task('watch', function(){
    gulp.watch('./src/app/**/*.js', ['browserify']);
    gulp.watch('./src/common/**/*.js', ['browserify']);
    gulp.watch('./src/sass/**', ['compass']);
    gulp.watch('./src/index.html', ['browserify']);
    gulp.watch('./src/assets/**/*', ['images']);
    livereload();
})

/////////////////////////////////////

function log(entry) {
    gutil.log("["+new Date().toTimeString()+"]", entry);
}