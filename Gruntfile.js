module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['./public/*'],
        browserify: {
            app: {
                src: ['./src/app/app.js'],
                dest: './public/app.js',
                options: {
                    transform: ['debowerify', 'partialify']
                }
            }
        },
        copy: {
            assets: {
                files: [{ dest: './public', src : '**', expand: true, cwd: './src/assets/' }]
            }
        },
        concat:{
            index: {
                src: ['./src/index.html'],
                dest: './public/index.html',
                options: {
                    process: true
                }
            }
        },
        watch: {
            src: {
                files: ['./src/app/**/*',
                        './src/common/**/*',
                        './src/index.html'],
                tasks: ['default'],
                options: {
                    livereload: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['compile']);
    grunt.registerTask('compile', ['clean','browserify','concat:index','copy']);

    grunt.event.on('watch', function(action, filepath, target) {
        grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });


};



