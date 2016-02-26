module.exports = function(grunt) {

    grunt.initConfig({

        // html validation
        validation: {
            files: {
                src: '*.html'
            },
            options: {
                stoponerror: true,
                generateReport: false,
                doctype: 'HTML5',
                charset: 'utf-8'
            }
        },

        csslint: {
            styles: {
                src: [
                    'css/*.css',
                    '!css/*.min.css'
                ]
            },
            options: {
                stoponerror: true,
                'box-sizing': false,
                'universal-selector': false,
                'box-model': false,
                'adjoining-classes': false,
                important: false
            }
        },

        jshint: {
            scripts: {
                src: [
                    'js/*.js',
                    '!js/*.min.js'
                ]
            }
        },

        htmlmin: {
            files: {
                expand: true,
                src: '*.html',
                dest: 'build/'
            },
            options: {
                collapseWhitespace: true, 
                preserveLineBreaks: true, 
                quoteCharacter: '"'
            }
        },

        cssmin: {
            styles: {
                expand: true,
                src: [
                    'css/*',
                    '!css/*.min.css'
                ],
                dest: 'build/'
            },
            options: {
                restructuring: false
            }
        },

        uglify: {
            scripts: {
                expand: true,
                src: 'js/*',
                dest: 'build/'
            },
            options: {
                mangle: {
                    toplevel: true
                },
                compress: {
                    sequences: true,
                    //properties: true,
                    dead_code: true,
                    drop_debugger: true,
                    comparisons: true,
                    conditionals: true,
                    evaluate: true,
                    booleans: true,
                    loops: true,
                    unused: true,
                    hoist_funs: true,
                    if_return: true,
                    join_vars: true,
                    cascade: true,
                    //negate_iife: true,
                    //drop_console: true
                }
            }
        }

    });


    grunt.loadNpmTasks('grunt-w3c-html-validation');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');


    grunt.registerTask('default', function() {
        grunt.log.writeln('The default task is \'check\'!');
        grunt.task.run('check');
    });

    grunt.registerTask('check', [ 'validation', 'csslint', 'jshint' ]);
    grunt.registerTask('build', [ 'htmlmin', 'cssmin', 'uglify' ]);

    grunt.registerTask('complete', function() { 
        grunt.task.run([ 'check', 'build' ]); 
    });

};