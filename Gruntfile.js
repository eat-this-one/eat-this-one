
module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON("package.json"),

        clean: {
            build: [ "public/web-build", "public/app-build", "public/shared-build", "dist" ]
        },

        // Minifies all JS into a single JS file.
        // The order is important:
        // * jQuery is the first requirement as it defines $
        // * local funcions will fill $. namespace and will be
        //   required by angular
        // * The last requirements will be angular and angular-ui
        uglify: {
            build: {
                files: {
                    "public/web-build/client.js": [
                        "public/bower_components/jquery/dist/jquery.min.js",
                        "public/bower_components/angular/angular.min.js",
                        "public/bower_components/angular-bootstrap/ui-bootstrap.min.js",
                        "public/javascripts/bootstrap.js",
                        "public/javascripts/i18n/**/*.js",
                        "public/javascripts/controllers/**/*.js" ,
                        "public/javascripts/ajax/**/*.js" ,
                        "public/javascripts/shared-services/**/*.js" ,
                        "public/javascripts/web-services/**/*.js",
                    ],
                    "public/app-build/client.js": [
                        "public/bower_components/jquery/dist/jquery.min.js",
                        "public/bower_components/angular/angular.min.js",
                        "public/bower_components/angular-bootstrap/ui-bootstrap.min.js",
                        "public/javascripts/bootstrap.js",
                        "public/javascripts/i18n/**/*.js",
                        "public/javascripts/controllers/**/*.js" ,
                        "public/javascripts/ajax/**/*.js" ,
                        "public/javascripts/shared-services/**/*.js" ,
                        "public/javascripts/app-services/**/*.js",
                    ],
                }
            }
        },

        // Less compiles to CSS all the .less files.
        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    "public/shared-build/styles.css": "public/stylesheets/**/*.less"
                }
            }
        },

        // Compiles Jade files to .html.
        jade : {
            options : {
                data : {
                    debug : false
                }
            },
            compile : {
                files : [
                    {
                        cwd : 'public/views',
                        src : '**/*.jade',
                        ext : '.html',
                        dest : 'public/shared-build',
                        expand : true
                    }
                ]
            }
        },

        // Run less if there are changes in .less files.
        // Run uglify if there are changes in .js files.
        watch: {
            dev_css : {
                files : [ "public/stylesheets/**/*.less" ],
                tasks : [ "less", "copy:build" ],
                options : {
                    nospawn : true
                }
            },
            dev_js : {
                files : [ "public/javascripts/**/*.js" ],
                tasks : [ "uglify", "copy:build" ],
                options : {
                    nospawn : true
                }

            },
            dev_html : {
                files : [ "public/views/**/*.jade" ],
                tasks : [ "jade", "copy:build" ],
                options : {
                    nospawn : true
                }
            }
        },

        // nodemon executes app.js again if there are changes
        // @see nodemon.json for what files are ignored.
        nodemon: {
            dev: {
                options: {
                    file: "./bin/www"
                }
            }
        },

        // nodemon and watch can watch in parallel.
        concurrent: {
            dev: ["nodemon", "watch"],
            options: {
                logConcurrentOutput: true
            }
        },

        // Joins all CSS files into 1.
        cssmin : {
            minify : {
                files : {
                    'public/shared-build/styles.css' : [ 'public/bower_components/bootstrap/dist/css/bootstrap.min.css', 'public/shared-build/styles.css' ]
                }
            }
        },

        // To copy into dist/ when generating distribution releases.
        copy: {
            build : {
                files : [
                    {
                        expand : true,
                        cwd : 'public/web-build/',
                        src : [ "**/*" ],
                        dest : "dist/web/"
                    }, {
                        expand : true,
                        cwd : 'public/app-build/',
                        src : [ "**/*" ],
                        dest : "dist/app/"
                    }, {
                        cwd : 'public/shared-build/',
                        expand : true,
                        src : [ "**/*" ],
                        dest : "dist/web/"
                    }, {
                        cwd : 'public/shared-build/',
                        expand : true,
                        src : [ "**/*" ],
                        dest : "dist/app/"
                    }
                ]
            }
        }

    });

    // Executable tasks.
    // TODO Generate non compressed version in build:dev.
    grunt.registerTask("build:prod", [ "clean:build", "uglify", "less", "cssmin", "jade:compile", "copy:build" ]);
    grunt.registerTask("build:dev", [ "clean:build", "uglify", "less", "cssmin", "jade:compile", "copy:build" ]);

    // While developing monitor the changes. 
    grunt.registerTask("run:dev", [ "build:dev", "concurrent" ]);

    // Dependencies.
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-nodemon");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-concurrent");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-jade");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
};
