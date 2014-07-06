Eat-this-one source code includes both backend, frontend and development tools.

* Backend
** NodeJS (server)
** ExpressJS (skeleton)
** MongoDB (persistence)

* Frontend
** AngularJS (HTML - JS bindings)
** Jade (HTML)
** Bootstrap & less (CSS)
** jQuery (JS)

=Installation=

* System dependencies

**sudo apt-get install git-core**
** sudo apt-get install mongodb**

** sudo npm install grunt-cli -g**
** sudo npm install express -g**
** sudo npm install bower -g**
** sudo npm install express-generator -g**
** sudo npm install cordova -g**

** git user.name '$PROJECT_AUTHOR_NAME'**
** git user.email '$PROJECT_AUTHOR_EMAIL'**

* Download source code
**git clone git://bitbucket.org/eat-this-one.git eat-this-one**
**cd eat-this-one

* Install project dependencies
**npm install**
**bower install**

* App development setup
**cordova create dist/app $PROJECT_NAME YOUR.REVERSE.DOMAIN YOUR_PROJECT_DISPLAY_NAME --save-copy=public/shared-build**
** **cd dist/app**
**cordoba platform add android**
** Edit dist/app/config.xml
** Edit dist/app/platforms/AndroidManifest.xml if necessary

==Android SDK (if you want to generate the app).

* Download SDK: http://developer.android.com/sdk/index.html


=Setup=

* Configure your MondoDB database (Backend).
** **cp config.json.dist config.json**

* Configure your frontend pointing to the backend URL (Frontend).
** **public/javascripts/shared/eatConfig.js**

* Create a virtual host to point to your dist/web dir.
<VirtualHost YOURHOSTNAME:80>
    DocumentRoot "/your/path/to/eat-this-one/dist/web"
    ServerName YOURHOSTNAME
    <Directory "/your/path/to/eat-this-one/dist/web">
        AllowOverride All
        Order Allow,Deny
    </Directory>
</VirtualHost>


=Development=

* Start development monitor
** **grunt run:dev**
* Frontend URL
** http://YOURHOSTNAME
* Backend server URL (IP better than localhost to deploy app in mobile)
** http://YOURIP:3000

==Info==

* CSS using less
** In public/stylesheets/**/*.less

* HTML views using Jade
** In public/views/**/*.jade

* Javascript
** Controllers in public/javascripts/controllers/**/*.js
** Models in public/javascripts/models/**/*.js
** All other shared code between web and mobile apps should go in public/javscripts/shared/**/*.js
** When a class differs between web and mobile apps two different classes should be created (A parent prototype in public/javascripts/shared can be used to extend common parts) one inside public/javascripts/web and another one inside public/javascripts/app sharing the same interface.

=Generate apps=

* Using emulator
** /path/to/sdk/tool/android avd to create an emulator if you don't have a real device
** Run cordova to build and deploy the app in an emulator
*** cordova emulate
* Using a real device
** Configure the http://developer.android.com/tools/device.html
** Run cordoba to build the app in the real device
*** cordova run
* Consider that you will need to access the backend through the app; you can use the IP rather than localhost
** http://developer.android.com/tools/devices/emulator.html#networkaddresses
