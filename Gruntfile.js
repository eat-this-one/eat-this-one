
module.exports = function(grunt) {

    var get_config_backend = function() {
        var config = grunt.file.readJSON('config_backend.json');

        // Prevent data loss.
        if (config.MONGO_URI !== "mongodb://localhost:27017/eat-this-one") {
            throw "Error: config_backend.json data can only be used in dev servers.";
        }

        return config;
    };

    grunt.initConfig({

        pkg: grunt.file.readJSON("package.json"),

        clean: {
            build: [ "public/web-build", "public/app-build", "public/shared-build", "dist/web", "dist/app/www" ]
        },

        // Minifies all JS into a single JS file.
        // Behavious changes during development as we don't want to compress, just merge into a single JS file.
        uglify: {
            dev: {
                options: {
                    compress: false,
                    beautify: true,
                    mangle: false,
                },
                files: {
                    // List of JS files to include.
                    //
                    // The order is important:
                    // * jQuery is the first requirement as it defines $
                    // * local funcions will fill $. namespace and will be
                    //   required by angular
                    // * The last requirements will be angular and angular-ui
                    "public/web-build/client.min.js": [
                        "public/bower_components/jquery/dist/jquery.js",
                        "public/bower_components/angular/angular.js",
                        "public/bower_components/angular-aria/angular-aria.js",
                        "public/bower_components/angular-animate/angular-animate.js",
                        "public/bower_components/angular-material/angular-material.js",
                        "public/bower_components/angular-md5/angular-md5.js",
                        "public/bower_components/angular-touch/angular-touch.js",
                        "public/javascripts/bootstrap.js",
                        "config_frontend.js",
                        "public/javascripts/i18n/**/*.js",
                        "public/javascripts/controllers/**/*.js" ,
                        "public/javascripts/directives/**/*.js" ,
                        "public/javascripts/restclient/**/*.js" ,
                        "public/javascripts/shared-services/**/*.js",
                        "public/javascripts/web-services/**/*.js"
                    ],
                    "public/app-build/client.min.js": [
                        "public/bower_components/jquery/dist/jquery.js",
                        "public/bower_components/angular/angular.js",
                        "public/bower_components/angular-aria/angular-aria.js",
                        "public/bower_components/angular-animate/angular-animate.js",
                        "public/bower_components/angular-material/angular-material.js",
                        "public/bower_components/angular-md5/angular-md5.js",
                        "public/bower_components/angular-touch/angular-touch.js",
                        "public/javascripts/bootstrap.js",
                        "config_frontend.js",
                        "public/javascripts/i18n/**/*.js",
                        "public/javascripts/controllers/**/*.js" ,
                        "public/javascripts/directives/**/*.js" ,
                        "public/javascripts/restclient/**/*.js" ,
                        "public/javascripts/shared-services/**/*.js",
                        "public/javascripts/app-services/**/*.js"
                    ]
                }
            },
            prod: {
                options: {
                    compress :true,
                    beautify: false,
                    mangle: true,
                },
                files: {
                    // List of JS files to include.
                    //
                    // The order is important:
                    // * jQuery is the first requirement as it defines $
                    // * local funcions will fill $. namespace and will be
                    //   required by angular
                    // * The last requirements will be angular and angular-ui
                    "public/web-build/client.min.js": [
                        "public/bower_components/jquery/dist/jquery.min.js",
                        "public/bower_components/angular/angular.min.js",
                        "public/bower_components/angular-aria/angular-aria.min.js",
                        "public/bower_components/angular-animate/angular-animate.min.js",
                        "public/bower_components/angular-material/angular-material.min.js",
                        "public/bower_components/angular-md5/angular-md5.min.js",
                        "public/bower_components/angular-touch/angular-touch.min.js",
                        "public/javascripts/bootstrap.js",
                        "config_frontend.js",
                        "public/javascripts/i18n/**/*.js",
                        "public/javascripts/controllers/**/*.js" ,
                        "public/javascripts/directives/**/*.js" ,
                        "public/javascripts/restclient/**/*.js" ,
                        "public/javascripts/shared-services/**/*.js",
                        "public/javascripts/web-services/**/*.js"
                    ],
                    "public/app-build/client.min.js": [
                        "public/bower_components/jquery/dist/jquery.min.js",
                        "public/bower_components/angular/angular.min.js",
                        "public/bower_components/angular-aria/angular-aria.min.js",
                        "public/bower_components/angular-animate/angular-animate.min.js",
                        "public/bower_components/angular-material/angular-material.min.js",
                        "public/bower_components/angular-md5/angular-md5.min.js",
                        "public/bower_components/angular-touch/angular-touch.min.js",
                        "public/javascripts/bootstrap.js",
                        "config_frontend.js",
                        "public/javascripts/i18n/**/*.js",
                        "public/javascripts/controllers/**/*.js" ,
                        "public/javascripts/directives/**/*.js" ,
                        "public/javascripts/restclient/**/*.js" ,
                        "public/javascripts/shared-services/**/*.js",
                        "public/javascripts/app-services/**/*.js"
                    ]
                }
            }
        },

        // JS Quality.
        jshint : {
            backend : [ "lib/**/*.js", "routes/*.js", "models/*.js", "appjs" ],
            frontend : [
                "public/javascripts/i18n/en.js",
                "public/javascripts/bootstrap.js",
                "public/javascripts/shared-services",
                "public/javascripts/web-services",
                "public/javascripts/app-services",
                "public/javascripts/directives",
                "public/javascripts/controllers",
                "public/javascripts/restclient"
            ]
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
                tasks : [ "less", "csslint", "cssmin", "copy:build" ],
                options : {
                    nospawn : true
                }
            },
            // JS Changes triggers tests.
            dev_js_frontend : {
                files : [ "public/javascripts/**/*.js", "config_frontend.js" ],
                tasks : [ "jshint:frontend", "uglify:dev", "copy:build" ],
                options : {
                    nospawn : true
                }
            },
            dev_js_backend : {
                files : [ "lib/**/*.js", "routes/*.js", "models/*.js", "config_backend.js" ],
                tasks : [ "jshint:backend" ],
                options : {
                    nospawn : true
                }
            },
            // Jade changes compiles HTML.
            dev_html : {
                files : [ "public/views/**/*.jade" ],
                tasks : [ "jade", "copy:build" ],
                options : {
                    nospawn : true
                }
            },
            // Frontend unit tests.
            test_frontend_unit_js : {
                files : [ "test/services/**/*.js", "test/controllers/**/*.js" ],
                tasks : [ "karma:unit:run" ],
                options : {
                    nospawn : true
                }
            },
            // Frontend e2e tests.
            test_frontend_e2e_js : {
                files : [ "test/e2e/**/*.js" ],
                tasks : [ "shell:reset_db", "protractor" ],
                options : {
                    nospawn : true
                }
            },
            // Backedn tests.
            test_backend_js : {
                files : [ "test/backend/**/*.js" ],
                tasks : [ "shell:reset_db", "shell:backend_tests" ],
                options : {
                    nospawn : true
                }
            }
        },

        connect: {
            server: {
                options: {
                    port: 8000,
                    hostname: '*',
                    directory: 'dist/web',
                    base: 'dist/web'
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
                configFile : 'karma.conf.js',
                background : true
            }
        },


        protractor: {
            options: {
                configFile: "protractor.conf.js",
                keepAlive: true,
                noColor: false,
                args: {
                    seleniumServerJar: 'node_modules/protractor/selenium/selenium-server-standalone-2.45.0.jar',
                    chromeDriver: 'node_modules/protractor/selenium/chromedriver'
                }
            },
            run: {}
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
                    'public/shared-build/styles.css' : [
                        'public/bower_components/bootstrap/dist/css/bootstrap.min.css',
                        'public/bower_components/angular-material/angular-material.min.css',
                        'public/shared-build/styles.css'
                    ]
                }
            }
        },

        // - Skip adjoining classes check because angular-material does not allow us
        // do it properly.
        // - Skip outline-none as this is a mobile app and there is no tab here.
        csslint : {
            strict : {
                src : ['public/shared-build/styles.css'],
                options : {
                    "adjoining-classes" : false,
                    "outline-none" : false
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
                        dest : 'dist/app/www'
                    }, {
                        expand : true,
                        cwd : 'public',
                        src : [ 'images/**/*'],
                        dest : 'dist/web'
                    }, {
                        expand : true,
                        cwd : 'public',
                        src : [ 'images/**/*'],
                        dest : 'dist/app/www'
                    }

                ]
            }
        },

        // Runs shell commands.
        shell : {
            reset_db : {
                command: 'mongo ' + get_config_backend().MONGO_URI.substr(10) + ' --eval "db.dropDatabase()"'
            },
            deploy_app : {
                command: 'cd dist/app ; cordova run --device'
            },
            backend_tests : {
                command:  'mocha test/backend/ --recursive'
            }
        }

    });

    // Uncompressed JS.
    grunt.registerTask("build:dev", [ "clean:build", "copy:resources", "uglify:dev", "less", "csslint", "cssmin", "jshint:backend", "jshint:frontend", "jade:compile", "copy:build" ]);

    // All compressed + linting before production.
    grunt.registerTask("build:prod", [ "clean:build", "copy:resources", "uglify:prod", "less", "csslint", "cssmin", "jshint:backend", "jshint:frontend", "jade:compile", "copy:build" ]);

    // While developing monitor the changes.
    grunt.registerTask("run:dev", [ "build:dev", "connect:server", "karma:unit:start", "concurrent" ]);

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
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks("grunt-karma");
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-protractor-runner');
};
