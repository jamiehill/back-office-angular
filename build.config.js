/**
 * The main configuration file for the build process
 */
module.exports = {

    /**
     * Name of the application.  This is used throughout, for naming
     * app related output files such as the main js and css files
     */
    appName: 'back-office',
    appTitle: 'Ats Back Office',

    srcDir: './src',
    destDir: './public',

    appDir: './src/js',
    assetDir: './src/assets',
    commonDir: './src/common',
    scssDir: './src/scss',

    bowerComponents: [],

    files: {

        output: './public/*',

        js: {

            app: {
                name: 'app.js',
                path: './src/js/app.js',
                output: 'back-office.js'
            },

            vendor: {
                name: 'vendor.js',
                path: './public/vendor.js'
            },

            noop: './lib/noop.js',
            all: [ './src/js/**/*.js', '!./src/js/**/*.spec.js' ]
        },


        html: {
            index: './src/index.html',
            output: './public/index.html',
            title: 'Ats Back Office',
            tpl: './src/js/**/*.tpl.html'
        },


        styles: {

            app: {
                name: 'app.css',
                path: './src/scss/app.css',
                output: 'app.js'
            },

            vendor: {
                name: 'vendor.css',
                path: './public/vendor.css',
                output: 'vendor.css'
            },

            all: './src/scss/**/*.scss',
            output: 'back-office.css',
            opts: {
                outputStyle: 'nested',
                sourceComments: 'map',
                includePaths : './src/scss'
            }
        },


        assets: {
            img: './src/assets/img/*',
            favicon: './src/assets/favicon.ico',
            all: './src/assets/**/*'
        },


        bower: './bower.json',
        gulp : './gulpfile.js',
        npm  : './package.json'
    },

    /**
     * Settings for the server task
     * When run, this task will start a connect server on
     * your build directory, great for livereload
     */
    server: {

        url: 'http://localhost:3000',
        opts: {
            root: ['./public'],
            port: '3000',
            livereload: { port: 35729 },
            open: {
                file: 'index.html'
            }
        }
    }

}