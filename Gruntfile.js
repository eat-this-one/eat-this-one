
module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON("package.json"),

        clean: {
            build: [ "public/web-build", "public/app-build", "public/shared-build", "dist/web", "dist/app/www" ]
        },

        // Minifies all JS into a single JS file.
        // Behavious changes during development as we don't want to compress, just merge into a single JS file.
        uglify: {
            build: {
                files: {
                    // List of JS files to include.
                    //
                    // The order is important:
                    // * jQuery is the first requirement as it defines $
                    // * local funcions will fill $. namespace and will be
                    //   required by angular
                    // * The last requirements will be angular and angular-ui
                    "public/web-build/client.js": [
                        "public/bower_components/jquery/dist/jquery.min.js",
                        "public/bower_components/angular/angular.min.js",
                        "public/bower_components/angular-bootstrap/ui-bootstrap.min.js",
                        "public/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
                        "public/javascripts/bootstrap.js",
                        "public/javascripts/i18n/**/*.js",
                        "public/javascripts/controllers/**/*.js" ,
                        "public/javascripts/directives/**/*.js" ,
                        "public/javascripts/ajax/**/*.js" ,
                        "public/javascripts/shared-services/**/*.js",
                        "public/javascripts/web-services/**/*.js"
                    ],
                    "public/app-build/client.js": [
                        "public/bower_components/jquery/dist/jquery.min.js",
                        "public/bower_components/angular/angular.min.js",
                        "public/bower_components/angular-bootstrap/ui-bootstrap.min.js",
                        "public/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
                        "public/javascripts/bootstrap.js",
                        "public/javascripts/i18n/**/*.js",
                        "public/javascripts/controllers/**/*.js" ,
                        "public/javascripts/directives/**/*.js" ,
                        "public/javascripts/ajax/**/*.js" ,
                        "public/javascripts/shared-services/**/*.js",
                        "public/javascripts/web-services/**/*.js",
                        "public/javascripts/app-services/**/*.js"
                    ]
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
                pretty: true,
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

        watch: {

            // Less changes compiles CSS.
            dev_css : {
                files : [ "public/stylesheets/**/*.less" ],
                tasks : [ "less", "cssmin", "copy:build" ],
                options : {
                    nospawn : true
                }
            },
            // JS Changes triggers karma unit tests and behaviour tests.
            // TODO Add behaviour tests
            // TODO Run JS tests!!
            dev_js : {
                files : [ "public/javascripts/**/*.js" ],
                tasks : [ "uglify", "copy:build" ],
                options : {
                    nospawn : true
                }

            },
            // Jade changes compiles HTML and only triggers behaviour tests.
            dev_html : {
                files : [ "public/views/**/*.jade" ],
                tasks : [ "jade", "copy:build" ],
                options : {
                    nospawn : true
                }
            },
            // test/ changes only triggers tests.
            test_js : {
                files : [ "test/**/*.js" ],
                tasks : [ "karma:unit:run" ],
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


        karma : {
            unit : {
                configFile : 'karma.config.js',
                background : true
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
                        dest : "dist/app/www"
                    }, {
                        cwd : 'public/shared-build/',
                        expand : true,
                        src : [ "**/*" ],
                        dest : "dist/web/"
                    }, {
                        cwd : 'public/shared-build/',
                        expand : true,
                        src : [ "**/*" ],
                        dest : "dist/app/www"
                    }
                ]
            },
            // Copies the static resources, they will not change during dev.
            resources : {
                files : [
                    {
                        expand : true,
                        cwd : 'public/bower_components/bootstrap',
                        src : [ 'fonts/**/*' ],
                        dest : 'dist/web'
                    }, {
                        expand : true,
                        cwd : 'public/bower_components/bootstrap',
                        src : [ 'fonts/**/*' ],
                        dest : 'dist/app'
                    }
                ]
            }
        },

        // Runs shell commands.
        shell : {
            deploy_app : {
                command: 'cd dist/app ; cordova run'
            }
        }

    });

    // Executable tasks.
    // TODO Generate non compressed version in build:dev.
    grunt.registerTask("build:prod", [ "clean:build", "copy:resources", "uglify", "less", "cssmin", "jade:compile", "copy:build" ]);
    grunt.registerTask("build:dev", [ "clean:build", "copy:resources", "uglify", "less", "cssmin", "jade:compile", "copy:build" ]);

    // While developing monitor the changes. 
    grunt.registerTask("run:dev", [ "build:dev", "karma", "concurrent" ]);

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
    grunt.loadNpmTasks("grunt-karma");
    grunt.loadNpmTasks('grunt-shell');
};
