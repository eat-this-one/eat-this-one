
module.exports = function(grunt) {

    var getConfigBackend = function() {
        var config = grunt.file.readJSON('config_backend.json');

        // Prevent data loss.
        if (config.MONGO_URI !== "mongodb://localhost:27017/eat-this-one") {
            throw "Error: config_backend.json data can only be used in dev servers.";
        }

        return config;
    };

    var getFrontendJsMin = function() {
        return [
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
        ];
    };

    var getFrontendJsDev = function() {
        return [
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
            "public/javascripts/shared-services/**/*.js"
        ];
    };

    grunt.initConfig({

        pkg: grunt.file.readJSON("package.json"),

        // These are the directories to clean as we will rebuild everything overwriting them.
        clean: {
            build: [ "public/web-build", "public/app-build", "public/shared-build", "dist/web", "dist/app/www" ]
        },

        // Minifies all JS files into a single JS file.
        // Behavious changes during development as we don't want to compress, just merge into a single JS file.
        uglify: {
            dev: {
                options: {
                    compress: false,
                    beautify: true,
                    mangle: false,
                },
                files: {
                    "public/web-build/client.min.js": getFrontendJsDev().concat([
                        "public/javascripts/web-services/**/*.js"
                    ]),
                    "public/app-build/client.min.js": getFrontendJsDev().concat([
                        "public/javascripts/app-services/**/*.js"
                    ])
                }
            },
            prod: {
                options: {
                    compress :true,
                    beautify: false,
                    mangle: true,
                },
                files: {
                    "public/web-build/client.min.js": getFrontendJsMin().concat([
                        "public/javascripts/web-services/**/*.js"
                    ]),
                    "public/app-build/client.min.js": getFrontendJsMin().concat([
                        "public/javascripts/app-services/**/*.js"
                    ])
                }
            }
        },

        // JS Quality.
        jshint : {
            backend : [ "lib/**/*.js", "routes/*.js", "models/*.js", "app.js" ],
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

        // Less compiles to CSS all the .less files (cssmin will minify them).
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

            // Less changes -> compile CSS.
            dev_css : {
                files : [ "public/stylesheets/**/*.less" ],
                tasks : [ "less", "csslint", "cssmin", "copy:build" ],
                options : {
                    nospawn : true
                }
            },
            // JS frontend changes -> JSHint + minification.
            dev_js_frontend : {
                files : [ "public/javascripts/**/*.js", "config_frontend.js" ],
                tasks : [ "jshint:frontend", "uglify:dev", "copy:build" ],
                options : {
                    nospawn : true
                }
            },
            // JS backend changes -> JSHint.
            dev_js_backend : {
                files : [ "lib/**/*.js", "routes/*.js", "models/*.js", "config_backend.js" ],
                tasks : [ "jshint:backend" ],
                options : {
                    nospawn : true
                }
            },
            // Jade changes -> compile HTML.
            dev_html : {
                files : [ "public/views/**/*.jade" ],
                tasks : [ "jade", "copy:build" ],
                options : {
                    nospawn : true
                }
            },
            // Frontend unit tests changes -> run them.
            test_frontend_unit_js : {
                files : [ "test/services/**/*.js", "test/controllers/**/*.js" ],
                tasks : [ "karma:unit:run" ],
                options : {
                    nospawn : true
                }
            },
            // Frontend e2e tests changes -> run them.
            test_frontend_e2e_js : {
                files : [ "test/e2e/**/*.js" ],
                tasks : [ "shell:reset_db", "protractor" ],
                options : {
                    nospawn : true
                }
            },
            // Backend tests changes -> run them.
            test_backend_js : {
                files : [ "test/backend/**/*.js" ],
                tasks : [ "shell:reset_db", "shell:backend_tests" ],
                options : {
                    nospawn : true
                }
            }
        },

        // Starts the frontend web app in localhost:8000.
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

        /**
         * Controlles node executing restarting the server if changes are detected.
         * @see .nodemonignore For ignored files.
         */
        nodemon: {
            dev: {
                options: {
                    file: "./bin/www"
                }
            }
        },

        /**
         * Runs unit tests.
         * @see karma.conf.js for more info.
         */
        karma : {
            unit : {
                configFile : 'karma.conf.js',
                background : true
            }
        },

        /**
         * Runs e2e tests.
         * @see protractor.conf.js for more info.
         */
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

        // Nodemon and watch can watch in parallel.
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

        /**
         * Checks CSS rules.
         *
         * - Skip adjoining classes. angular-material does not allow us
         *   do it properly.
         * - Skip outline-none. This is a mobile app and there is no tab here.
         */
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
            // Copies the static resources, they rarely change during development.
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

        // Other commands that runs through CLI.
        shell : {
            // Reset the local backend database. Useful for testing.
            reset_db : {
                command: 'mongo ' + getConfigBackend().MONGO_URI.substr(10) + ' --eval "db.dropDatabase()"'
            },
            // Runs the mobile app in the currently plugged android device.
            install_app : {
                command: 'cd dist/app ; cordova run --device'
            },
            // Updates to the specified version and pushes changes to github and eat-this-one.com.
            release : {
                command: function(version) {
                    var clicommand = 'bin/release.sh ';
                    if (typeof version !== "undefined") {
                        clicommand = clicommand + version;
                    }
                    return clicommand;
                }
            },
            // Runs backend tests using mocha.
            backend_tests : {
                command:  'mocha test/backend/ --recursive'
            }
        }

    });

    // While developing monitor the changes.
    grunt.registerTask(
        "run:dev",
        "Starts development mode. Watches for changes building minified CSS, minified JS and HTML from Jade templates, running CSSlint and JSHint. Tests automatically run when there are changes on them.",
        [ "build:dev", "connect:server", "karma:unit:start", "concurrent" ]
    );

    // Alias for shell:deploy_app.
    grunt.registerTask(
        "run:frontend:android",
        "Runs the current build in the currently plugged android device.",
        ["shell:install_app"]
    );

    // Uncompressed JS.
    grunt.registerTask(
        "build:dev",
        "Builds frontend development versions. Both mobile app and web for testing.",
        [ "clean:build", "copy:resources", "uglify:dev", "less", "csslint", "cssmin", "jshint:backend", "jshint:frontend", "jade:compile", "copy:build" ]
    );

    // All compressed.
    grunt.registerTask(
        "build:prod",
        "Builds frontend production versions. Both mobile app and web although only app is meant to be deployed.",
        [ "clean:build", "copy:resources", "uglify:prod", "less", "csslint", "cssmin", "jshint:backend", "jshint:frontend", "jade:compile", "copy:build" ]
    );

    // Test backend (frontend depends on browsers and stuff).
    grunt.registerTask(
        "build:test",
        "Executes backend tests. Note that it requires the backend server to be running (npm start)",
        [ "build:dev", "shell:reset_db", "shell:backend_tests"]
    );

    // Deploys backend to eat-this-one.com public server.
    grunt.registerTask(
        "release",
        "Deploys the backend to eat-this-one.com public server and updates package.json and bower.json with the specified version. (It will not probably work for you).",
        function(version) {
            // Custom alias as version is a var.
            if (typeof version !== "undefined") {
                grunt.task.run('shell:release:' + version);
            } else {
                grunt.task.run('shell:release');
            }
        }
    );

    grunt.registerTask("default", ["run:dev"]);

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
