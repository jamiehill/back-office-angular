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

    rootDir: './',
    srcDir: './src',
    destDir: './public',
    tmpDir: './.tmp',

    appDir: './src/js',
    assetDir: './src/assets',
    commonDir: './src/common',
    scssDir: './src/scss',

    bowerComponents: [],
    browserify: {
        entries:"./src/js/app.js",
        debug: true,
        insertGlobals: true,
        transforms: ['partialify','deamdify']
    },

    files: {

        output: './public/*.*',

        js: {

            app: {
                name: 'app.js',
                source: './src/js/app.js',
                output: './public/app*.js',
                tag: 'app:js'
            },

            vendor: {
                name: 'vendor.js',
                output: './public/vendor*.js',
                tag: 'vendor:js'
            },

            template: {
                name: 'template.js',
                output: './public/template*.js',
                tag: 'template:js'
            },

            noop: './lib/noop.js',
            all: [ './src/**/*.js', './src/**/*.js', '!./src/**/*.spec.js' ],
            output: './public/**/*.js'
        },


        html: {
            name: 'index.html',
            source: './src/index.html',
            output: './public/index.html',
            title: 'Ats Back Office',
        },


        tpl: {
            name: 'template.js',
            all: './src/**/*.tpl.html',
            opts: {
                module: 'app.templates',
                standalone: true
            }
        },


        styles: {

            app: {
                name: 'app.css',
                source: './src/scss/app.css',
                output: './public/app*.css',
                tag: 'app-style:css'
            },

            vendor: {
                name: 'vendor.css',
                output: './public/vendor*.css',
                tag: 'vendor-style:css',
                all: [
                    './bower_components/bootstrap/dist/css/bootstrap.min.css'
//                    './bower_components/kendo-ui/styles/web/kendo.common.core.min.css',
//                    './bower_components/kendo-ui/styles/web/kendo.bootstrap.min.css'
                ]
            },

            all: './src/scss/**/*.scss',
            output: 'back-office.css',

            scss: {
                opts: {
                    outputStyle: 'nested',
                    sourceComments: 'map',
                    includePaths : ['./src/scss']
                }
            },

            compass: {
                opts: {
                    config_file: './config.rb'
                }
            }

            

        },


        images: {
            img: './src/images/*',
            favicon: './src/images/favicon.ico',
            all: './src/images/**/*',
            folder: 'img',
            dest: './public/img'
        },


        fonts: {
            all: ['./bower_components/**/fonts/*'],
            icons: './public/fonts/icons',
            dest: './public/fonts'
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
            livereload: true,
            open: {
                file: 'index.html'
            }
        },

        express: {
            port: 4000,
            root: './.tmp',
            liveReloadPort: 35729,
            timeout: 5000
        }
    }

}