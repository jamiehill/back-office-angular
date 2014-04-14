module.exports = function (grunt) {
    grunt.initConfig({
        src: {
            js: ['src/**/*.js'],
            html: ['src/index.html'],
            tpl: {
                app: ['src/app/**/*.tpl.html'],
                common: ['src/common/**/*.tpl.html']
            }
        },
        dirs: {
            src: './src',
            app: '<%= dirs.src %>/app',
            common: '<%= dirs.src %>/common',
            assets: '<%= dirs.src %>/assets',
            output: './dist'
        },
        watchify: {
            debug: {
                entry: '<%= dirs.app %>/app.js',
                compile: '<%= dirs.output %>/app.js',
                debug: true,
                verbose: true
            },
            compile: {
                entry: '<%= dirs.app %>/app.js',
                compile: '<%= dirs.output %>/app.js'
            },
            watch: {
                files: [ "<%= dirs.app %>/**/*.js", "<%= dirs.common %>/**/*.js"],
                tasks: [ 'compile' ]
            }
        },
        clean: ['<%= dirs.output %>/*'],
        copy: {
            assets: {
                files: [{ dest: '<%= dirs.output %>', src : '**', expand: true, cwd: 'src/assets/' }]
            }
        },
        concat:{
            index: {
                src: ['src/index.html'],
                dest: '<%= dirs.output %>/index.html',
                options: {
                    process: true
                }
            }
        }
    });

    grunt.loadNpmTasks('watchify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['clean','watchify:debug','concat:index','copy']);
    grunt.registerTask('compile', ['clean','watchify:compile','concat:index','copy']);
    grunt.registerTask('watch', 'browserify2:compile');


};



