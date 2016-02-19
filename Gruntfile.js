module.exports = function(grunt) {

    grunt.initConfig({

        jshint: {
            scripts: {
                src: 'js/*'
            }
        },

        uglify: {
            scripts: {
                expand: true,
                src: 'js/*',
                dest: 'build/',
                ext: '.min.js',
                extDot: 'first' 
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
        },

        // html validation
        'validation': {
            files: {
                src: '*.html'
            },
            options: {
                stoponerror: true,
                generateReport: false
            }
        },

        'csslint': {
            files: {
                src: 'css/*.css'
            },
            options: {
                stoponerror: true,
                'box-sizing': false,
                'universal-selector': false
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-w3c-html-validation');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', [ 'jshint', 'validation', 'csslint' ]);
    grunt.registerTask('check', [ 'jshint', 'validation', 'csslint' ]);
    grunt.registerTask('build', [ 'uglify' ]);
    grunt.registerTask('all', [ 'jshint', 'validation', 'csslint', 'uglify' ]);

};