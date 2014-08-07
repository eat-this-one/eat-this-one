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

**sudo apt-get install git-core mongodb ant**

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

==Android SDK (if you want to generate the app)==

* Download SDK: http://developer.android.com/sdk/index.html
* Add adt-bundle-linux/sdk/platform-tools and adt-bundle-linux/sdk/tools to $PATH
* Run **android sdk** and install "Google Play services" and "Google Repository"
* http://developer.android.com/google/gcm/gs.html for messaging

=Setup=

* Configure your MondoDB database (Backend).
** **cp config.json.dist config.json**

* Configure your Android development tools path
** **cp development.properties.dist development.properties**
** Edit development.properties with your own values

* Configure your frontend pointing to the backend URL if it is different from the default one.
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

* Development setup
** **./setup_dev.sh**
*** You may need to install previous android sdk APIs as cordova is not always using the latest version, if it is the case, run **android sdk** and select the required versions
** Edit dist/app/config.xml
** Edit dist/app/platforms/AndroidManifest.xml
*** Set android:debuggable="true" in <application> node


=Development=

* Start development monitor
** ./init_development.sh
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
** AngularJS directives in public/javascripts/directives/**/*.js
** All shared code between web and mobile apps should go in public/javscripts/shared/**/*.js
** When a class differs between web and mobile apps two different classes should be created (A parent prototype in public/javascripts/shared can be used to extend common parts) one inside public/javascripts/web and another one inside public/javascripts/app sharing the same interface.

=Generate apps=

* Using emulator
** /path/to/sdk/tool/android avd to create an emulator if you don't have a real device
** The app is autodeployed when saving

* Using an emulator (not sure if it will be all ok, I use a real device)
** Set an AVD http://developer.android.com/tools/devices/emulator.html
** **cd dist/app ; cordova emulate**
* Using a real device
** Configure the device http://developer.android.com/tools/device.html
** **sudo ./adb devices**
** **cd dist/app ; cordova run**
* Consider that you will need to access the backend through the app; you can use the IP rather than localhost
** http://developer.android.com/tools/devices/emulator.html#networkaddresses
