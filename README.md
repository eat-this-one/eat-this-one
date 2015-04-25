# Eat this one!

[Eat this one!](http://www.eat-this-one.com) is a mobile app to share cooking specialties with your colleagues or classmates at lunch time.

This repository includes:

* An ExpressJS REST API backed by MongoDB
* An AngularJS frontend compiled to Android and iOS apps using cordova
* Grunt tasks for development, testing and deployment.

# Installation
    git clone git://github.com/eat-this-one/eat-this-one.git
    cd eat-this-one

### System dependencies
    npm install -g grunt-cli
    npm install -g bower
    npm install -g cordova
    npm install -g mocha
    npm install -g ios-deploy

You only need ios-deploy package if you are interested in using the iOS emulator.

### (Android) Android SDK

Follow the normal procedure to install the Android SDK; Android Studio is not required. http://developer.android.com/sdk/index.html

Also http://developer.android.com/google/gcm/gs.html for Google Cloud Messaging.

### (iOS) XCode

Follow the normal procedure http://cordova.apache.org/docs/en/4.0.0/guide_platforms_ios_index.md.html#iOS%20Platform%20Guide

### Install dependencies

    // Install node dependencies including the local grunt.
    npm install

    // Depending on whether you want to test using an android device or an ios device.
    grunt install:android
    grunt install:ios



This will install all dependencies, create the cordova project adding the specified platform and build the current codebase.

Later on you can use **grunt update** to update the project dependencies.

### Tips

* Note that, if you want to run the app in your mobile, you can set your IP or hostname in config/frontend.js.
* (Android) You may need to install previous android sdk APIs as cordova is not always using the latest version
    * If it is the case, run **android sdk** and select the required versions

# Development

    grunt

The default task is an alias of **grunt dev** task which starts the backend server and watches for codebase changes:

* Runs JSHint and restarts the backend server if required
* Runs JSHint, minifies and concatenates frontend JS files
* Runs CSSLint and compiles less to CSS and minifies it
* Compiles Jade templates to HTML files
* Runs tests if you modify them

### Browse the web environment
    http://localhost:8000

### Backend server URL
    http://localhost:3000
As commented above, the hostname or the IP might be better than localhost to test in mobile.

### Install the app on the emulator
    grunt run:android:emulator
    grunt run:ios:emulator

This is basically running **cordova emulate android** and **cordova emulate ios** in dist/app directory.

### Install the app on your mobile

##### Android
    grunt run:android:device

It starts the adb server, installs the current build and outputs the device log.

In case you have problems accessing the backend from the mobile http://developer.android.com/tools/devices/emulator.html#networkaddresses

##### iOS
* Start XCode
* Set up your development team & register your testing device
* For more info: https://cordova.apache.org/docs/en/4.0.0/guide_platforms_ios_index.md.html#iOS%20Platform%20Guide

### Other commands
    grunt --help

# Test

    npm test

This only runs backend tests. There are frontend unit tests and e2e tests but only run when editing them.

# Project code structure

* **Backend app (JS - Node)**
    * Models
        [models/*.js](https://github.com/eat-this-one/eat-this-one/blob/master/models)
    * Routes
        [routes/*.js](https://github.com/eat-this-one/eat-this-one/blob/master/routes)
    * Other modules
        [lib/*.js](https://github.com/eat-this-one/eat-this-one/blob/master/lib)

* **Frontend app (JS - AngularJS)**
    * Controllers
        [public/javascripts/controllers/*.js](https://github.com/eat-this-one/eat-this-one/blob/master/public/javascripts/controllers)
    * AngularJS directives
        [public/javascripts/directives/*.js](https://github.com/eat-this-one/eat-this-one/blob/master/public/javascripts/directives)
    * AngularJS services
        * If they make use of cordova plugins
            * [public/javascripts/app-services/*.js](https://github.com/eat-this-one/eat-this-one/blob/master/public/javascripts/app-services)
            * [public/javascripts/web-services/*.js](https://github.com/eat-this-one/eat-this-one/blob/master/public/javascripts/web-services)
        * Otherwise
            * [public/javascripts/shared-services/*.js](https://github.com/eat-this-one/eat-this-one/blob/master/public/javascripts/shared-services)

* **Styles (CSS)**
    [public/stylesheet/*.less](https://github.com/eat-this-one/eat-this-one/blob/master/public/stylesheets)

* **Views (HTML)**
    [public/views/*.jade](https://github.com/eat-this-one/eat-this-one/blob/master/public/views)


# Thanks

## Third party code

* Frontend
    * AngularJS - https://angularjs.org/
    * Karma - http://karma-runner.github.io/
    * Grunt - http://gruntjs.com/
    * Cordova - https://cordova.apache.org/
    * Jade - jade-lang.com
    * Less - http://lesscss.org/
    * Bower - http://bower.io/
    * JQuery - https://jquery.com/
    * Bootstrap - http://getbootstrap.com/css/
    * Glyphicons - http://glyphicons.com/
* Backend
    * NodeJS - https://nodejs.org/
    * ExpressJS - http://expressjs.com/
    * MongoDB - https://www.mongodb.org/
    * Mongoose - http://mongoosejs.com/
    * Dokku - https://github.com/progrium/dokku
* And other third party code listed in:
    * https://github.com/eat-this-one/eat-this-one/blob/master/package.json
    * https://github.com/eat-this-one/eat-this-one/blob/master/bower.json
