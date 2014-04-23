/**
 * The main configuration file for the build process
 */
module.exports = {

    /**
     * The build directory is where our project is compiled during
     * development and the 'compile_dir' folder is where our app resides once it's
     * completely built.
     */
    buildDir: './build',
    compileDir: './bin',
    srcDir: './src',
    assetDir: './<%= srcDir %>/assets',

    /**
     * The main application files needed to compile and run the app
     */
    appFiles: {

        entry: [ '<%= srcDir %>/app/app.js' ],
        output: [ '<%= buildDir %>/app.js'],
        vendor: ['<%= buildDir %>/vendor.js'],

        js: [ '<%= srcDir %>/app/**/*.js', '!<%= srcDir %>/common/**/*.js', '!<%= srcDir %>/**/*.spec.js' ],
        tpl: [ '<%= srcDir %>/app/**/*.tpl.html', '<%= srcDir %>/common/**/*.tpl.html' ],

        assets: [ '<%= srcDir %>/assets/**/*'],
        html: [ '<%= srcDir %>/index.html' ],
        sass: '<%= srcDir %>/sass/main.sass'
    },

    /**
     * Settings for the server task
     * When run, this task will start a connect server on
     * your build directory, great for livereload
     */
    server: {
        url: "http://localhost:8080",
        app: "google chrome",

        port: 8081, // 0 = random port
        host: null, // null/falsy means listen to all, but will auto open localhost

        // Enable disable default auto open
        // false: run with --open to open
        // true: run with --no-open to not open, recommended if port is 0
        openByDefault: false,

        // set to false to prevent request logging
        // set to any non-`true` value to configure the logger
        log: false,

        // Live Reload server port
        lrPort: 35729
    }

}