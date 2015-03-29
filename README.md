# Eat-this-one
Eat-this-one source code includes both backend, frontend and development tools.

* Backend
    * NodeJS (server)
    * MongoDB (persistence)

* Frontend
    * AngularJS (HTML - JS bindings)
    * Jade (HTML)
    * Bootstrap & less (CSS)
    * jQuery (JS)

# Installation

## System dependencies
    sudo apt-get install gcc make build-essential
    sudo apt-get install git-core mongodb ant
    git user.name '$PROJECT_AUTHOR_NAME'
    git user.email '$PROJECT_AUTHOR_EMAIL'

## Download source code
    git clone git://bitbucket.org/eat-this-one.git eat-this-one
    cd eat-this-one

## (Android) Download Android SDK

Follow the normal procedure to install android SDK (http://developer.android.com/sdk/index.html)

* Add adt-bundle-linux/sdk/platform-tools and adt-bundle-linux/sdk/tools to $PATH
* Run **android sdk** and install:
    * "Google Play services"
    * "Google Play APK Expansion Library"
    * "Google Repository"
* http://developer.android.com/google/gcm/gs.html for google cloud messaging

## (iOS) Download XCode

## Configure your development environment

### Configure your backend.
    cp config_backend.json.dist config_backend.json

Edit config_backend.json with your own values

### Configure your frontend pointing to the backend URL if it is different than the default one.
    cp config_frontend.js.dist config_frontend.js

Edit config_frontend.js with your own values

Consider that you will need to access the backend through the app; you can use the IP rather than localhost (http://developer.android.com/tools/devices/emulator.html#networkaddresses)

### Set your android development tools path
    cp development.properties.dist development.properties

Edit development.properties with your own values

### Create a virtual host to point to your dist/web
    <VirtualHost YOURHOSTNAME:80>
        DocumentRoot "/your/path/to/eat-this-one/dist/web"
        ServerName YOURHOSTNAME
        <Directory "/your/path/to/eat-this-one/dist/web">
            AllowOverride All
            Order Allow,Deny
        </Directory>
    </VirtualHost>

## Install frontend and backend dependencies
* **./install.sh android** or **./install.sh ios**
* (Android) You may need to install previous android sdk APIs as cordova is not always using the latest version
    * If it is the case, run **android sdk** and select the required versions
* Edit dist/app/config.xml
    * Change whatever info you like
    * Add **<icon src="icon.png" />** under **<widget>** node
    * Add **<icon platform="ios" src="icon-ios.png" />** under **<widget>** node
    * Add **<splash src="splash.png" />** under **<widget>** node

# Development

* Start development monitoring changes
    * **./init_development.sh**
* Browse the web environment
    * http://YOURHOSTNAME
* Backend server URL (IP better than localhost to deploy app in mobile)
    * http://YOURIP:3000
* Install the app to your mobile
    * Android
        * Turn on your device debugging options
        * Plug-in your android device (USB) to your computer
        * Allow your computer to debug your device (you will be asked for it if required)
        * **./install_app.sh** - It also opens adb logcat

To update project dependencies to latests
* **./update.sh android** or **./update.sh ios**

# Project structure info

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
    * Libs in **lib/*.js**
