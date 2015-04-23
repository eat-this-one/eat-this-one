[Eat this one!](http://www.eat-this-one.com) source code. An app to Share cooking specialties with your colleagues or classmates at lunch time.

This repository includes both backend, frontend mobile apps and development scripts.

* Backend
    * NodeJS (server)
    * MongoDB (persistence)

* Frontend (android and ios through cordova)
    * AngularJS (HTML - JS bindings)
    * Jade (HTML)
    * Bootstrap & less (CSS)
    * jQuery (JS)

# Installation

## System dependencies
    git user.name '$PROJECT_AUTHOR_NAME'
    git user.email '$PROJECT_AUTHOR_EMAIL'
    sudo apt-get install gcc make build-essential
    sudo apt-get install git-core mongodb ant
    sudo npm install -g grunt-cli
    sudo npm install -g express
    sudo npm install -g bower
    sudo npm install -g express-generator
    sudo npm install -g cordova
    sudo npm install -g mocha

## Download source code
    git clone git://github.com/eat-this-one/eat-this-one.git
    cd eat-this-one

## (Android) Download Android SDK

Follow the normal procedure to install android SDK (http://developer.android.com/sdk/index.html)

* Add adt-bundle-linux/sdk/platform-tools and adt-bundle-linux/sdk/tools to $PATH
* Run **android sdk** and install:
    * "Google Play services"
    * "Google Play APK Expansion Library"
    * "Google Repository"
* http://developer.android.com/google/gcm/gs.html for google cloud messaging
* Set up your android development tools path
    cp development.properties.dist development.properties
* Edit development.properties with your own values

## (iOS) Download and install XCode

Follow the normal procedure (http://cordova.apache.org/docs/en/4.0.0/guide_platforms_ios_index.md.html#iOS%20Platform%20Guide)

## Configure your development environment

### Configure your backend.
    cp config_backend.json.dist config_backend.json

Edit config_backend.json with your own values. For non-production you only need to set LOGS_DIR. To set
these values in production environments you can use environment vars.

### Configure your frontend pointing to the backend URL if it is different than the default one.
    cp config_frontend.js.dist config_frontend.js

Edit config_frontend.js with your own values

Consider that you will need to access the backend through the app; you can use the IP rather than localhost (http://developer.android.com/tools/devices/emulator.html#networkaddresses)

## Install dependencies
    ./install.sh android
    or
    ./install.sh ios
* (Android) You may need to install previous android sdk APIs as cordova is not always using the latest version
    * If it is the case, run **android sdk** and select the required versions
* Edit dist/app/config.xml
    * Change whatever info you like

# Development

* Start development servers.
    * **./init_development.sh** (it starts development servers and rebuild + restarts them if there are changes that requires it)
* Browse the web environment
    * http://localhost:8000
* Backend server URL (as commented above, IP better than localhost to deploy app in mobile)
    * http://YOURIP:3000
* Install the app to your mobile
    * Android
        * Turn on your device debugging options
        * Plug-in your android device (USB) to your computer
        * Allow your computer to debug your device (you will be asked for it if required)
        * **./install_app.sh** - It also opens adb logcat
    * iOS
        * Start XCode
        * Set up your development team
        * Register your device for testing
        * For more info: https://cordova.apache.org/docs/en/4.0.0/guide_platforms_ios_index.md.html#iOS%20Platform%20Guide

To update project dependencies to latest upstream versions:
* **./update.sh android** or **./update.sh ios**

# Project code structure

* **Styles (CSS - less)**
    * In **public/stylesheet/**

* **Views (HTML - Jade)**
    * In **public/views/**

* **Frontend app (JS - AngularJS)**
    * Controllers in **public/javascripts/controllers/**
    * AngularJS directives in **public/javascripts/directives/**
    * All shared code between web and mobile apps should go in **public/javascripts/shared-services/**
    * Cordova plugins uses should go to **public/javascripts/app-services/SERVICENAME.js** and a **public/javascripts/web-services/SERVICENAME.js** service should implement the same interface so the app can work on both mobile and web browser.

* **Backend app (JS - node)**
    * Models in **models/*.js**
    * Routes in **routes/*.js**
    * Other modules in **lib/*.js**

# Thanks & third party code
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
* And third party code listed in:
    * https://github.com/eat-this-one/eat-this-one/blob/master/package.json
    * https://github.com/eat-this-one/eat-this-one/blob/master/bower.json
